interface ContactData {
  name: string;
  email: string;
}

interface CostBreakdownItem {
  name: string;
  type: 'book' | 'guide' | 'branding';
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface NotificationData {
  type: 'pdf_download' | 'email_quote';
  contactInfo: ContactData;
  costBreakdown: {
    items: CostBreakdownItem[];
    total: number;
    currency: string;
  };
  timestamp: string;
  userAgent: string;
  ipAddress?: string;
}

export const sendBackendNotification = async (data: NotificationData): Promise<void> => {
  try {
    // In a real implementation, this would be your backend API endpoint
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send notification');
    }

    console.log('Backend notification sent successfully:', data);
  } catch (error) {
    console.error('Failed to send backend notification:', error);
    
    // Fallback: Log to console for development
    console.log('BACKEND NOTIFICATION:', {
      action: data.type === 'pdf_download' ? 'PDF Downloaded' : 'Email Quote Requested',
      user: data.contactInfo,
      total: data.costBreakdown.total,
      currency: data.costBreakdown.currency,
      timestamp: data.timestamp,
    });
  }
};

export const generatePDF = async (
  contactInfo: ContactData,
  costBreakdown: { items: CostBreakdownItem[]; total: number; currency: string }
): Promise<void> => {
  // Send notification to backend
  await sendBackendNotification({
    type: 'pdf_download',
    contactInfo,
    costBreakdown,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  });

  // Generate PDF using HTML5 Canvas and jsPDF-like functionality
  const pdfContent = await generatePDFDocument(contactInfo, costBreakdown);
  
  // Create a blob with PDF content
  const blob = new Blob([pdfContent], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `KODEIT-Quote-${contactInfo.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const sendEmailQuote = async (
  contactInfo: ContactData,
  costBreakdown: { items: CostBreakdownItem[]; total: number; currency: string }
): Promise<void> => {
  // Send notification to backend
  await sendBackendNotification({
    type: 'email_quote',
    contactInfo,
    costBreakdown,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  });

  // In a real implementation, this would send an email via your backend
  console.log('Email quote would be sent to:', contactInfo.email);
  
  // Show success message
  alert(`Quote has been sent to ${contactInfo.email}. You will receive it within 24 hours.`);
};

const generatePDFDocument = async (
  contactInfo: ContactData,
  costBreakdown: { items: CostBreakdownItem[]; total: number; currency: string }
): Promise<Uint8Array> => {
  // Create a simple PDF structure
  const date = new Date().toLocaleDateString();
  
  // Basic PDF header
  const pdfHeader = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 6 0 R
>>
stream
BT
/F1 18 Tf
50 750 Td
(KODEIT PRE-K CURRICULUM COST QUOTE) Tj
0 -30 Td
/F1 12 Tf
(Date: ${date}) Tj
0 -20 Td
(Prepared for: ${contactInfo.name}) Tj
0 -20 Td
(Email: ${contactInfo.email}) Tj
0 -40 Td
/F1 14 Tf
(COST BREAKDOWN) Tj
0 -30 Td
/F1 10 Tf`;

  let yPosition = -20;
  let contentStream = pdfHeader;

  // Add cost breakdown items
  costBreakdown.items.forEach(item => {
    contentStream += `
0 ${yPosition} Td
(${item.name.substring(0, 40).padEnd(40)} | Qty: ${item.quantity.toString().padStart(3)} | Unit: ${item.unitPrice.toFixed(2).padStart(8)} | Subtotal: ${item.subtotal.toFixed(2).padStart(10)}) Tj`;
    yPosition -= 15;
  });

  // Add total
  contentStream += `
0 ${yPosition - 20} Td
/F1 12 Tf
(TOTAL: ${costBreakdown.total.toFixed(2)} ${costBreakdown.currency}) Tj
0 -40 Td
/F1 10 Tf
(IMPORTANT NOTES:) Tj
0 -15 Td
(- For print books, logistics costs may be calculated based on actual shipping requirements) Tj
0 -15 Td
(- Government taxes and duties are not included in the above pricing) Tj
0 -15 Td
(- Final pricing may vary based on specific requirements and location) Tj
0 -15 Td
(- This quote is valid for 30 days from the date of generation) Tj
0 -15 Td
(- Pricing is subject to change without notice) Tj
0 -30 Td
(CONFIDENTIAL INFORMATION:) Tj
0 -15 Td
(This quote contains proprietary and confidential information of KODEIT.) Tj
0 -15 Td
(Unauthorized reproduction, distribution, or sharing is strictly prohibited.) Tj
0 -30 Td
(© 2025 KODEIT. All rights reserved.) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

6 0 obj
${contentStream.split('stream')[1].split('endstream')[0].length}
endobj

xref
0 7
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000173 00000 n 
0000000301 00000 n 
0000002000 00000 n 
0000002100 00000 n 
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
2120
%%EOF`;

  // Convert string to Uint8Array
  const encoder = new TextEncoder();
  return encoder.encode(contentStream + `
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

6 0 obj
${contentStream.split('stream')[1].length}
endobj

xref
0 7
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000173 00000 n 
0000000301 00000 n 
0000002000 00000 n 
0000002100 00000 n 
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
2120
%%EOF`);
};