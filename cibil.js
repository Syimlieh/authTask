const fs = require("fs");
const PdfPrinter = require("pdfmake");
const cibilJson = require("./cibiljsonMalik.json");
const {
  generateAddress,
  generateEnquiries,
  termsNExplanations,
  generateTermsNExplanation,
  footerText2,
  footerText1,
  generateHeader,
  generateColumnsWithStyle,
} = require("./utils/pdf.utils");

const fonts = {
  Inter: {
    light: "assets/fonts/inter-Light.ttf",
    regular: "assets/fonts/inter-Regular.ttf",
    normal: "assets/fonts/inter-Regular.ttf",
    semibold: "assets/fonts/inter-SemiBold.ttf",
    bold: "assets/fonts/inter-Bold.ttf",
  },
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

const printer = new PdfPrinter(fonts);

const { InquiryResponseHeader, CCRResponse } = cibilJson;

const docDefinition = {
  content: [...generateHeader(InquiryResponseHeader)],
  styles: {
    light: {
      font: "inter",
      fontSize: 12,
    },
    regular: {
      font: "inter",
      fontSize: 12,
    },
    semibold: {
      font: "inter",
      fontSize: 12,
      bold: true,
    },
    bold: {
      font: "inter",
      fontSize: 12,
      bold: true,
    },
  },

  defaultStyle: {
    columnGap: 20,
    font: "Inter",
  },
};

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream("cibil.pdf"));
pdfDoc.end();
