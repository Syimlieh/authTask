const { fillColor } = require("pdfkit");

const formatResponse = (res, data, status = 200) => {
  return res.status(status).json(data);
};

function generateColumns(...texts) {
  const columns = texts.map((text) => ({ width: "*", text }));
  return { columns };
}

module.exports = {
  formatResponse,
  // generateHeader,
  // generateColumns,
  // generateColumnsWithStyle,
  // generateAddress,
  // generateEnquiries,
  // termsNExplanations,
  // generateTermsNExplanation,
  // footerText1,
  // footerText2,
};
