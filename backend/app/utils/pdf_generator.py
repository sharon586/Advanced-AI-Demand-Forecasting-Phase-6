from reportlab.pdfgen import canvas


def create_pdf():
    pdf = canvas.Canvas("report.pdf")

    pdf.drawString(100, 750, "AI Forecast Report")

    pdf.save()