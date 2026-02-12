import { jsPDF } from 'jspdf';

/**
 * Generate and download invoice PDF for an order
 * @param {Object} order - Order object with items, customer, total, etc.
 * @param {Object} settings - Store settings (name, email, phone, address)
 * @param {string|null} logo - Base64 encoded logo image
 */
export const generateInvoice = (order, settings, logo) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // Helper function to add text with wrapping
    const addText = (text, x, y, maxWidth, fontSize = 10, fontStyle = 'normal') => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', fontStyle);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * fontSize * 0.5);
    };

    // Company Header
    doc.setFillColor(41, 84, 168); // Blue header
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Add Logo if provided
    let textXPostion = 15;
    if (logo) {
        try {
            // Add image: addImage(imageData, format, x, y, width, height, alias, compression, rotation)
            doc.addImage(logo, 'PNG', 15, 8, 24, 24);
            textXPostion = 45; // Move text to the right of the logo
        } catch (e) {
            console.error('Error adding logo to PDF:', e);
        }
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(settings.storeName || 'Gurubagavan Sarees', textXPostion, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(settings.storeEmail || '', textXPostion, 28);
    doc.text(settings.storePhone || '', textXPostion, 34);

    // Invoice Title
    yPos = 55;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth - 15, yPos, { align: 'right' });

    // Invoice Details (Right side)
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice No: ${order.orderId || order.id}`, pageWidth - 15, yPos, { align: 'right' });
    yPos += 6;
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, pageWidth - 15, yPos, { align: 'right' });

    // Store Address (Left side)
    yPos = 55;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('From:', 15, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    if (settings.storeAddress) {
        const addressLines = doc.splitTextToSize(settings.storeAddress, 70);
        addressLines.forEach(line => {
            doc.text(line, 15, yPos);
            yPos += 5;
        });
    }

    // Customer Details
    yPos = Math.max(yPos, 80);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 15, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(order.customer.fullName || order.customer.name || '', 15, yPos);
    yPos += 5;
    doc.text(order.customer.phone || '', 15, yPos);
    yPos += 5;
    doc.text(order.customer.email || '', 15, yPos);
    yPos += 5;
    if (order.customer.address) {
        const addressLines = doc.splitTextToSize(order.customer.address, 70);
        addressLines.forEach(line => {
            doc.text(line, 15, yPos);
            yPos += 5;
        });
    }

    // Items Table
    yPos += 10;
    const tableStart = yPos;

    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Item', 20, yPos);
    doc.text('Qty', pageWidth - 80, yPos, { align: 'right' });
    doc.text('Price', pageWidth - 50, yPos, { align: 'right' });
    doc.text('Total', pageWidth - 20, yPos, { align: 'right' });

    yPos += 8;
    doc.setFont('helvetica', 'normal');

    // Table Rows
    order.items.forEach((item, index) => {
        if (yPos > pageHeight - 60) {
            doc.addPage();
            yPos = 20;
        }

        const itemName = item.name || '';
        const nameLines = doc.splitTextToSize(itemName, 100);

        nameLines.forEach((line, lineIndex) => {
            doc.text(line, 20, yPos + (lineIndex * 5));
        });

        const itemPrice = item.discountPrice || item.price || 0;
        doc.text(item.quantity?.toString() || '1', pageWidth - 80, yPos, { align: 'right' });
        doc.text(`Rs. ${itemPrice.toLocaleString('en-IN')}`, pageWidth - 50, yPos, { align: 'right' });
        doc.text(`Rs. ${(itemPrice * (item.quantity || 1)).toLocaleString('en-IN')}`, pageWidth - 20, yPos, { align: 'right' });

        yPos += Math.max(nameLines.length * 5, 8);

        // Draw separator line
        if (index < order.items.length - 1) {
            doc.setDrawColor(220, 220, 220);
            doc.line(15, yPos - 2, pageWidth - 15, yPos - 2);
        }
    });

    // Total Section
    yPos += 5;
    doc.setDrawColor(0, 0, 0);
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 8;

    const subtotal = order.items.reduce((sum, item) => sum + ((item.discountPrice || item.price || 0) * (item.quantity || 1)), 0);
    const shipping = order.shippingCharge || 0;
    const total = order.total || (subtotal + shipping);

    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal:', pageWidth - 60, yPos);
    doc.text(`Rs. ${subtotal.toLocaleString('en-IN')}`, pageWidth - 20, yPos, { align: 'right' });
    yPos += 6;

    if (shipping > 0) {
        doc.text('Shipping:', pageWidth - 60, yPos);
        doc.text(`Rs. ${shipping.toLocaleString('en-IN')}`, pageWidth - 20, yPos, { align: 'right' });
        yPos += 6;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total:', pageWidth - 60, yPos);
    doc.text(`Rs. ${total.toLocaleString('en-IN')}`, pageWidth - 20, yPos, { align: 'right' });



    // Notes section
    yPos += 15;
    if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = 20;
    }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for shopping with us!', 15, yPos);

    // Signature Section
    yPos = pageHeight - 40;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Authorized Signature', pageWidth - 60, yPos);
    doc.line(pageWidth - 60, yPos + 5, pageWidth - 15, yPos + 5);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save PDF
    const fileName = `Invoice_${order.orderId || order.id}_${Date.now()}.pdf`;
    doc.save(fileName);
};
