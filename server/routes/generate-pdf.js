const express = require('express');
const PDFDocument = require('pdfkit');
const router = express.Router();

/**
 * POST /api/generate-pdf
 * Generate PDF from formatted medical report
 */
router.post('/', async (req, res) => {
  try {
    const { report, filename } = req.body;

    if (!report || typeof report !== 'string') {
      return res.status(400).json({ error: 'Report text is required' });
    }

    // Create a PDF document
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: {
        top: 72,
        bottom: 72,
        left: 72,
        right: 72
      }
    });

    // Set response headers for PDF download
    const pdfFilename = filename || `medical-report-${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFilename}"`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add header
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text('PATHOLOGY REPORT', { align: 'center' })
       .moveDown(0.5);

    doc.fontSize(10)
       .font('Helvetica')
       .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' })
       .moveDown(1.5);

    // Add horizontal line
    doc.moveTo(72, doc.y)
       .lineTo(540, doc.y)
       .stroke()
       .moveDown(1);

    // Parse and format the report content
    const lines = report.split('\n');
    
    for (let line of lines) {
      line = line.trim();
      
      if (!line) {
        doc.moveDown(0.5);
        continue;
      }

      // Check if line is a section header (all caps with colon)
      if (line.match(/^[A-Z\s/]+:$/)) {
        doc.moveDown(0.5)
           .fontSize(12)
           .font('Helvetica-Bold')
           .text(line, { 
             continued: false,
             lineGap: 4
           })
           .moveDown(0.3);
      } else {
        // Regular paragraph text
        doc.fontSize(11)
           .font('Helvetica')
           .text(line, {
             align: 'left',
             lineGap: 3
           });
      }
    }

    // Add footer
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      
      // Add page number
      doc.fontSize(9)
         .font('Helvetica')
         .text(
           `Page ${i + 1} of ${pageCount}`,
           72,
           doc.page.height - 50,
           { align: 'center' }
         );
    }

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('PDF generation error:', error);
    
    // If headers haven't been sent yet, send error response
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'PDF generation failed', 
        details: error.message 
      });
    }
  }
});

module.exports = router;

