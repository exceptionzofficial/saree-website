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
    doc.text(settings.storeName || 'Gurubagavan Sarees', textXPostion, 24);
    if (settings.gstNumber || settings.gst) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`GST: ${settings.gstNumber || settings.gst}`, textXPostion, 31);
    }
    
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
    
    // Store Name below 'From:' if user wants it there too (optional, but storeAddress is usually name + lines)
    // Actually, storeName is already in header, let's keep details below address.
    
    if (settings.storeAddress) {
        const addressLines = doc.splitTextToSize(settings.storeAddress, 70);
        addressLines.forEach(line => {
            doc.text(line, 15, yPos);
            yPos += 5;
        });
    }
    
    // Add Email and Phone to From section
    if (settings.storeEmail) {
        doc.text(`Email: ${settings.storeEmail}`, 15, yPos);
        yPos += 5;
    }
    if (settings.storePhone) {
        doc.text(`Phone: ${settings.storePhone}`, 15, yPos);
        yPos += 5;
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
    const tableHeaderY = yPos;

    // Table Header
    doc.setFillColor(245, 245, 245);
    doc.rect(15, yPos - 6, pageWidth - 30, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    
    // Column positions
    const colItem = 20;
    const colQty = 140;
    const colPrice = 170;
    const colTotal = 195;

    doc.text('Item Description', colItem, yPos);
    doc.text('Qty', colQty, yPos, { align: 'right' });
    doc.text('Price', colPrice, yPos, { align: 'right' });
    doc.text('Total', colTotal, yPos, { align: 'right' });

    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    // Table Rows
    order.items.forEach((item, index) => {
        // Calculate name height
        const itemName = item.name || '';
        const nameLines = doc.splitTextToSize(itemName, 90);
        const itemHeight = Math.max(nameLines.length * 5, 8);

        if (yPos + itemHeight > pageHeight - 50) {
            doc.addPage();
            yPos = 25;
            // Redraw Header on new page
            doc.setFillColor(245, 245, 245);
            doc.rect(15, yPos - 6, pageWidth - 30, 10, 'F');
            doc.setFont('helvetica', 'bold');
            doc.text('Item Description', colItem, yPos);
            doc.text('Qty', colQty, yPos, { align: 'right' });
            doc.text('Price', colPrice, yPos, { align: 'right' });
            doc.text('Total', colTotal, yPos, { align: 'right' });
            yPos += 8;
            doc.setFont('helvetica', 'normal');
        }

        nameLines.forEach((line, lineIndex) => {
            doc.text(line, colItem, yPos + (lineIndex * 5));
        });

        const itemPrice = item.discountPrice || item.price || 0;
        doc.text(item.quantity?.toString() || '1', colQty, yPos, { align: 'right' });
        doc.text(`Rs. ${itemPrice.toLocaleString('en-IN')}`, colPrice, yPos, { align: 'right' });
        doc.text(`Rs. ${(itemPrice * (item.quantity || 1)).toLocaleString('en-IN')}`, colTotal, yPos, { align: 'right' });

        yPos += itemHeight + 2;

        // Draw light separator line
        doc.setDrawColor(230, 230, 230);
        doc.line(15, yPos - 1, pageWidth - 15, yPos - 1);
        yPos += 2;
    });

    // Total Section
    yPos += 5;
    if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
    }
    
    doc.setDrawColor(41, 84, 168); // Use primary color for final total line
    doc.setLineWidth(0.5);
    doc.line(pageWidth - 85, yPos, pageWidth - 15, yPos);
    yPos += 8;

    const subtotal = order.items.reduce((sum, item) => sum + ((item.discountPrice || item.price || 0) * (item.quantity || 1)), 0);
    const shipping = order.shippingCharge || 0;
    const total = order.total || (subtotal + shipping);

    doc.setFontSize(10);
    doc.text('Subtotal:', pageWidth - 75, yPos);
    doc.text(`Rs. ${subtotal.toLocaleString('en-IN')}`, pageWidth - 15, yPos, { align: 'right' });
    yPos += 6;

    if (shipping > 0) {
        doc.text('Shipping:', pageWidth - 75, yPos);
        doc.text(`Rs. ${shipping.toLocaleString('en-IN')}`, pageWidth - 15, yPos, { align: 'right' });
        yPos += 6;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(41, 84, 168);
    doc.text('Grand Total:', pageWidth - 75, yPos);
    doc.text(`Rs. ${total.toLocaleString('en-IN')}`, pageWidth - 15, yPos, { align: 'right' });

    // Computer Generated Note
    yPos += 30;
    if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 30;
    }
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('This is a computer-generated invoice and does not require a physical signature.', pageWidth / 2, yPos, { align: 'center' });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save PDF
    const fileName = `Invoice_${order.orderId || order.id}_${Date.now()}.pdf`;
    doc.save(fileName);
};
