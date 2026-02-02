import { createContext, useContext, useState, useEffect } from 'react';
import { useOrders } from './OrderContext';

const MembershipContext = createContext();

export const useMembership = () => {
    const context = useContext(MembershipContext);
    if (!context) {
        throw new Error('useMembership must be used within MembershipProvider');
    }
    return context;
};

// Generate unique referral code
const generateReferralCode = (name) => {
    const prefix = name.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${random}`;
};

export const MembershipProvider = ({ children }) => {
    const { settings } = useOrders();

    // Membership requests (pending payments)
    const [membershipRequests, setMembershipRequests] = useState(() => {
        const saved = localStorage.getItem('membershipRequests');
        return saved ? JSON.parse(saved) : [];
    });

    // Active memberships
    const [memberships, setMemberships] = useState(() => {
        const saved = localStorage.getItem('memberships');
        return saved ? JSON.parse(saved) : [];
    });

    // Current user's membership (mock - in real app, would use auth)
    const [currentUserEmail, setCurrentUserEmail] = useState(() => {
        return localStorage.getItem('currentMemberEmail') || '';
    });

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('membershipRequests', JSON.stringify(membershipRequests));
    }, [membershipRequests]);

    useEffect(() => {
        localStorage.setItem('memberships', JSON.stringify(memberships));
    }, [memberships]);

    useEffect(() => {
        if (currentUserEmail) {
            localStorage.setItem('currentMemberEmail', currentUserEmail);
        }
    }, [currentUserEmail]);

    // Submit payment request
    const submitPaymentRequest = (userData, screenshotUrl) => {
        const request = {
            id: Date.now(),
            ...userData,
            screenshotUrl,
            status: 'pending',
            submittedAt: new Date().toISOString()
        };
        setMembershipRequests(prev => [...prev, request]);
        setCurrentUserEmail(userData.email);
        return request;
    };

    // Admin: Approve request
    const approveRequest = (requestId) => {
        const request = membershipRequests.find(r => r.id === requestId);
        if (!request) return;

        // Create new membership
        const newMembership = {
            id: Date.now(),
            userId: request.email,
            name: request.name,
            email: request.email,
            mobile: request.mobile,
            referralCode: generateReferralCode(request.name),
            status: 'active',
            referrals: [],
            referralCount: 0,
            moneyBackClaimed: false,
            goldCoinClaimed: false,
            activatedAt: new Date().toISOString(),
            completedAt: null
        };

        setMemberships(prev => [...prev, newMembership]);
        setMembershipRequests(prev =>
            prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r)
        );
    };

    // Admin: Reject request
    const rejectRequest = (requestId) => {
        setMembershipRequests(prev =>
            prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r)
        );
    };

    // Add referral (when someone uses a referral code)
    const addReferral = (referralCode, referredUser) => {
        setMemberships(prev => prev.map(m => {
            if (m.referralCode === referralCode && m.status === 'active') {
                const newReferralCount = m.referralCount + 1;
                const newReferrals = [...m.referrals, {
                    name: referredUser.name,
                    date: new Date().toISOString()
                }];

                // Check if membership should complete (7 referrals)
                const shouldComplete = newReferralCount >= 7;

                return {
                    ...m,
                    referrals: newReferrals,
                    referralCount: newReferralCount,
                    goldCoinClaimed: shouldComplete,
                    moneyBackClaimed: newReferralCount >= 5 || m.moneyBackClaimed,
                    status: shouldComplete ? 'completed' : 'active',
                    completedAt: shouldComplete ? new Date().toISOString() : null
                };
            }
            return m;
        }));
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

    // Check if user has any membership history
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

    const value = {
        // State
        membershipRequests,
        memberships,
        currentUserEmail,
        settings,

        // Actions
        setCurrentUserEmail,
        submitPaymentRequest,
        approveRequest,
        rejectRequest,
        addReferral,

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
