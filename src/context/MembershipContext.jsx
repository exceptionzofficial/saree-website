import { createContext, useContext, useState, useEffect } from 'react';
import { useOrders } from './OrderContext';
import { membershipsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const MembershipContext = createContext();

export const useMembership = () => {
    const context = useContext(MembershipContext);
    if (!context) {
        throw new Error('useMembership must be used within MembershipProvider');
    }
    return context;
};

export const MembershipProvider = ({ children }) => {
    const { settings } = useOrders();
    const { user, isAuthenticated } = useAuth();

    const [membershipRequests, setMembershipRequests] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [useAPI, setUseAPI] = useState(true);

    // Current user's email - synced from AuthContext
    const currentUserEmail = isAuthenticated && user?.email ? user.email : '';

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [requests, members] = await Promise.all([
                membershipsAPI.getRequests(),
                membershipsAPI.getAll()
            ]);
            setMembershipRequests(requests);
            setMemberships(members);
            setUseAPI(true);
        } catch (err) {
            console.warn('API unavailable, using localStorage:', err.message);
            // Fallback to localStorage
            const savedRequests = localStorage.getItem('membershipRequests');
            const savedMemberships = localStorage.getItem('memberships');
            if (savedRequests) setMembershipRequests(JSON.parse(savedRequests));
            if (savedMemberships) setMemberships(JSON.parse(savedMemberships));
            setUseAPI(false);
        }
        setLoading(false);
    };

    // Save to localStorage as backup
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('membershipRequests', JSON.stringify(membershipRequests));
            localStorage.setItem('memberships', JSON.stringify(memberships));
        }
    }, [membershipRequests, memberships, loading]);

    const submitPaymentRequest = async (userData, screenshotFile, planId = 'premium') => {
        if (useAPI) {
            try {
                const formData = new FormData();
                formData.append('name', userData.name);
                formData.append('email', userData.email);
                formData.append('mobile', userData.mobile);
                formData.append('planId', planId);

                // Automatically include referral code from user profile (registration)
                if (user?.referralId) {
                    formData.append('referralCode', user.referralId);
                }

                if (screenshotFile) {
                    formData.append('screenshot', screenshotFile);
                }

                const request = await membershipsAPI.submitRequest(formData);
                setMembershipRequests(prev => [...prev, request]);
                return request;
            } catch (err) {
                console.error('Error submitting request:', err);
                throw err;
            }
        } else {
            // Local fallback
            const request = {
                id: Date.now().toString(),
                ...userData,
                screenshotUrl: screenshotFile,
                status: 'pending',
                submittedAt: new Date().toISOString()
            };
            setMembershipRequests(prev => [...prev, request]);
            return request;
        }
    };

    // Admin: Approve request
    const approveRequest = async (requestId) => {
        if (useAPI) {
            try {
                const result = await membershipsAPI.approveRequest(requestId);
                setMemberships(prev => [...prev, result.membership]);
                setMembershipRequests(prev =>
                    prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r)
                );
                return result.membership;
            } catch (err) {
                console.error('Error approving request:', err);
                throw err;
            }
        } else {
            // Local fallback
            const request = membershipRequests.find(r => r.id === requestId);
            if (!request) return;

            const prefix = request.name.substring(0, 3).toUpperCase();
            const random = Math.random().toString(36).substring(2, 6).toUpperCase();

            const newMembership = {
                email: request.email,
                name: request.name,
                mobile: request.mobile,
                referralCode: `${prefix}${random}`,
                status: 'active',
                referrals: [],
                referralCount: 0,
                moneyBackClaimed: false,
                goldCoinClaimed: false,
                activatedAt: new Date().toISOString()
            };

            setMemberships(prev => [...prev, newMembership]);
            setMembershipRequests(prev =>
                prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r)
            );
        }
    };

    // Admin: Reject request
    const rejectRequest = async (requestId) => {
        if (useAPI) {
            try {
                await membershipsAPI.rejectRequest(requestId);
                setMembershipRequests(prev =>
                    prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r)
                );
            } catch (err) {
                console.error('Error rejecting request:', err);
                throw err;
            }
        } else {
            setMembershipRequests(prev =>
                prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r)
            );
        }
    };

    // Add referral
    const addReferral = async (referralCode, referredUser) => {
        if (useAPI) {
            try {
                const updatedMembership = await membershipsAPI.addReferral(referralCode, referredUser.name);
                setMemberships(prev => prev.map(m =>
                    m.referralCode === referralCode ? updatedMembership : m
                ));
                return updatedMembership;
            } catch (err) {
                console.error('Error adding referral:', err);
                throw err;
            }
        } else {
            // Local fallback
            setMemberships(prev => prev.map(m => {
                if (m.referralCode === referralCode && m.status === 'active') {
                    const newReferralCount = m.referralCount + 1;
                    const shouldComplete = newReferralCount >= 7;

                    return {
                        ...m,
                        referrals: [...m.referrals, { name: referredUser.name, date: new Date().toISOString() }],
                        referralCount: newReferralCount,
                        goldCoinClaimed: shouldComplete,
                        moneyBackClaimed: newReferralCount >= 5 || m.moneyBackClaimed,
                        status: shouldComplete ? 'completed' : 'active',
                        completedAt: shouldComplete ? new Date().toISOString() : null
                    };
                }
                return m;
            }));
        }
    };

    // Submit reward claim (cashback or gold)
    const submitRewardClaim = async (claimData) => {
        if (useAPI) {
            try {
                const result = await membershipsAPI.submitRewardClaim(claimData);
                // Update local status with 'pending_admin' to match backend
                if (claimData.type === 'cashback') {
                    setMemberships(prev => prev.map(m =>
                        m.email === claimData.email ? { ...m, moneyBackClaimed: 'pending_admin' } : m
                    ));
                } else if (claimData.type === 'gold') {
                    setMemberships(prev => prev.map(m =>
                        m.email === claimData.email ? { ...m, goldCoinClaimed: 'pending_admin' } : m
                    ));
                }
                return result;
            } catch (err) {
                console.error('Error submitting reward claim:', err);
                throw err;
            }
        } else {
            // Local fallback
            setMemberships(prev => prev.map(m => {
                if (m.email === claimData.email) {
                    return {
                        ...m,
                        moneyBackClaimed: claimData.type === 'cashback' ? 'pending_admin' : m.moneyBackClaimed,
                        goldCoinClaimed: claimData.type === 'gold' ? 'pending_admin' : m.goldCoinClaimed
                    };
                }
                return m;
            }));

            const claims = JSON.parse(localStorage.getItem('rewardClaims') || '[]');
            claims.push({ ...claimData, id: Date.now(), status: 'pending', date: new Date().toISOString() });
            localStorage.setItem('rewardClaims', JSON.stringify(claims));
        }
    };

    // Get current user's membership
    const getCurrentMembership = () => {
        if (!currentUserEmail) return null;
        return memberships.find(m => m.email === currentUserEmail) || null;
    };

    // Get current user's pending request
    const getCurrentRequest = () => {
        if (!currentUserEmail) return null;
        return membershipRequests.find(r => r.email === currentUserEmail && r.status === 'pending') || null;
    };

    // Check user membership status
    const getUserMembershipStatus = () => {
        if (!currentUserEmail) return 'none';

        const pending = membershipRequests.find(r => r.email === currentUserEmail && r.status === 'pending');
        if (pending) return 'pending';

        const active = memberships.find(m => m.email === currentUserEmail && m.status === 'active');
        if (active) return 'active';

        const completed = memberships.find(m => m.email === currentUserEmail && m.status === 'completed');
        if (completed) return 'completed';

        return 'none';
    };

    const refreshData = () => {
        loadData();
    };

    const value = {
        // State
        membershipRequests,
        memberships,
        currentUserEmail,
        settings,
        loading,
        useAPI,

        // Actions
        submitPaymentRequest,
        approveRequest,
        rejectRequest,
        addReferral,
        submitRewardClaim,
        refreshData,

        // Getters
        getCurrentMembership,
        getCurrentRequest,
        getUserMembershipStatus,
        getPendingRequests: () => membershipRequests.filter(r => r.status === 'pending'),
        getApprovedRequests: () => membershipRequests.filter(r => r.status === 'approved'),
        getAllMembers: () => memberships
    };

    return (
        <MembershipContext.Provider value={value}>
            {children}
        </MembershipContext.Provider>
    );
};

export default MembershipContext;
