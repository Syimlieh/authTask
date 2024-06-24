const fs = require("fs");
const dns = require("dns");
const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const swaggerFile = require("./swagger_output.json");
const { getUrl } = require("./config/mongo.config");
const cibilJson = require("./cibilJson.json");
const server = express();
const PDFDocument = require("pdfkit");
const { format } = require("date-fns");
// PORT
const PORT = process.env.PORT || 4000;

// CORS
server.use(cors());

// Export Json to PDF
const pdfDoc = new PDFDocument();
const today = format(new Date(), "MMMM dd, yyyy");

const pageHeight = pdfDoc.page.height;
const pageWidth = pdfDoc.page.width;

const regularTextOption = {
  paragraphGap: 4,
};

const subHeadingTextOption = {
  paragraphGap: 5,
};

const continueOption = {
  paragraphGap: 3,
  continued: true,
};

const listOptions = {
  bulletRadius: 1,
  bulletIndent: 10,
  indent: 10,
  paragraphGap: 4,
};

const interSemiBold = "assets/fonts/Inter-SemiBold.ttf";
const interRegular = "assets/fonts/Inter-Regular.ttf";

pdfDoc.on("pageAdded", () => {
  pdfDoc.rect(0, pageHeight - 30, pageWidth, 60).fill("#263041");
  pdfDoc.fill("#000000");
});
pdfDoc.rect(0, 0, pageWidth, 50).fill("#263041");
pdfDoc.image("assets/bankloan.png", 10, 10, { width: 95 });
// footer for first page
pdfDoc.rect(0, pageHeight - 30, pageWidth, 60).fill("#263041");
pdfDoc.fill("#000000");

pdfDoc
  .font(`${interSemiBold}`, 10)
  .fill("#000000")
  .text(today, { align: "right" });
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Digi Team Member - Agreement", { ...regularTextOption });
pdfDoc.moveDown(2);
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    `This Agreement ("Digi Team Member") is entered into as of ${today}, between `,
    { ...regularTextOption, ...continueOption }
  )
  .fillColor("#3363C1")
  .text("Starpower Digital Technologies Pvt. Ltd", {
    ...regularTextOption,
    ...continueOption,
  })
  .fillColor("#000000")
  .text(
    ' a company organized and existing under the laws of MCA, Hyderabad Jurisdiction, having its principal place of business at Paigah Plaza, Hyderabad ("Company"), and',
    { ...regularTextOption, ...continueOption }
  )
  .fillColor("#3363C1")
  .text(`#Rohit Bisht `, { ...regularTextOption, ...continueOption })
  .fillColor("#000000")
  .text(
    `an individual/entity engaged in the business of loan sourcing, with principal office located at #279 H, pocket 2, East Delhi, Delhi - 110091 ("Digi Team Member")`,
    { ...regularTextOption }
  );

pdfDoc.moveDown(1);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .fillColor("#3363C1")
  .text(`1. Engagement of Services`, { ...subHeadingTextOption });
pdfDoc
  .font(`${interRegular}`, 10)
  .fillColor("#000000")
  .text(
    `1.1 Company engages Digi Team Member, and Digi Team Member agrees to provide loan sourcing services as per the terms and conditions outlined in this Agreement.
1.2 Digi Team Member shall source loan applications from potential borrowers and submit them to the Company for further processing.`,
    { ...regularTextOption }
  );

pdfDoc.moveDown(1);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .fillColor("#3363C1")
  .text(`2. Terms and Conditions`, { ...subHeadingTextOption });
pdfDoc
  .font(`${interRegular}`, 10)
  .fillColor("#000000")
  .text(
    `2.1 Digi Team Member acknowledges that it has read, understood, and agrees to comply with all terms and conditions set forth in this Agreement, including any attached schedules or annexures.
2.2 Digi Team Member shall adhere to the lending policies, procedures, and guidelines established by Company, as well as comply with all relevant laws, regulations, and guidelines issued by the Reserve Bank of India (RBI) and other regulatory bodies.`,
    { ...regularTextOption }
  );

pdfDoc.moveDown(1);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .fillColor("#3363C1")
  .text(`3. Data Privacy and Storage`, { ...subHeadingTextOption });
pdfDoc
  .font(`${interRegular}`, 10)
  .fillColor("#000000")
  .text(
    `3.1 Digi Team Member agrees to maintain the confidentiality and security of all borrower information, including but not limited to personal, financial, and credit-related data ("Data").
3.2 Digi Team Member shall not disclose, sell, or misuse the Data obtained during the course of business without explicit consent from the Company and borrowers, except as required by law or regulatory authorities.
3.3 Digi Team Member shall implement appropriate technical and organizational measures to safeguard the Data against unauthorized access, disclosure, alteration, or destruction.
    `,
    { ...regularTextOption }
  );

pdfDoc.moveDown(1);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .fillColor("#3363C1")
  .text(`4. Compliance`, { ...subHeadingTextOption });
pdfDoc
  .font(`${interRegular}`, 10)
  .fillColor("#000000")
  .text(
    `4.1 Digi Team Member agrees to comply with all applicable laws, rules, regulations, and guidelines related to loan sourcing activities, including but not limited to anti-money laundering (AML), know your customer (KYC), and customer due diligence (CDD) requirements.
4.2 Digi Team Member shall promptly provide any information or documentation requested by Company or regulatory authorities to demonstrate compliance with applicable laws and regulations.
    `,
    { ...regularTextOption }
  );

pdfDoc.moveDown(1);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .fillColor("#3363C1")
  .text(`5. Termination`, { ...subHeadingTextOption });
pdfDoc
  .font(`${interRegular}`, 10)
  .fillColor("#000000")
  .text(
    `5.1 Company may terminate this Agreement upon with/without any written notice for any reason.    
5.2 Upon termination, Digi Team Member shall return all confidential information and data provided by Company and cease all loan sourcing activities on behalf of Company.
    `,
    { ...regularTextOption }
  );

pdfDoc.moveDown(1);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .fillColor("#3363C1")
  .text(`6. Miscellaneous`, { ...subHeadingTextOption });
pdfDoc
  .font(`${interRegular}`, 10)
  .fillColor("#000000")
  .text(
    `6.1 This Agreement constitutes the entire understanding between the parties regarding the subject matter herein and supersedes all prior agreements, representations, and understandings.    
6.2 Any amendments or modifications to this Agreement must be made in writing and signed by authorized representatives of both parties.
IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.
    `,
    { ...regularTextOption }
  );

pdfDoc.moveDown(1);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text(`MODEL CODE OF CONDUCT FOR THE DIRECT SELLING AGENTS (DSAs)`, {
    ...subHeadingTextOption,
  });
pdfDoc
  .font(`${interRegular}`, 10)
  .fillColor("#000000")
  .text(
    `The bank has initiated certain guidelines to enhance customer satisfaction and at the same time strictly comply with regulatory guidelines. One such initiative is, not to call on customers on phone numbers, which has been registered in the " Do Not Call " (DNC) registry of the bank.    
The guideline of DNC includes the calls made by the bank directly or by its Direct Selling Agents and Marketing Agencies. These are based on banking code of conduct issued by the Reserve Ban k of India.
In view of this, you are hereby requested to be guided by the DNC process followed by the bank and ensure that you or your agents and associates call no customer registered in this DNC. You therefore need to send your database to the bank on a periodic basis - as advised to you from time to time and ensure that the same is de-duped with our central DNC registry. Any name, which appears in our DNC registry and is called upon by the bank or its associates will attract heavy penalty and will also lead to financial and reputation loss to the bank.
The Agreement covers the terms and conditions related to these guidelines on DNC. You need to sign and send it back as token of acceptance of the same. You would have already received the Model Code of Conduct, which is applicable to your executives. In case you have not received it we will send it again for your reference and implementation.
We hope you appreciate that this is a very serious requirement from a customer sensitivity point of view and we need to comply with the regulatory guidelines.
In case you need any clarification, kindly get in touch with your RM or the Sales Manager who would explain the same to you.
    `,
    { ...regularTextOption }
  );

pdfDoc.moveDown(1);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text(`1.0 Preamble`, { ...subHeadingTextOption });
pdfDoc
  .font(`${interRegular}`, 10)
  .fillColor("#000000")
  .text(
    `Model Code of Conduct for the Direct Selling Agents (DSAs) is a non-statutory code issued by Indian Banks' Association, a voluntary association of Banks in India for adoption and implementation by DSAs while operating as Agents of Banks and Financial Institutions.   
    1.1 Applicability
Upon adoption and inclusion as part of agreement between HDFC bank and the DSA, this code will apply to all persons involved in marketing and distribution of any loan or other financial product of HDFC Bank. The Direct Selling Agent (DSA) and its Tele —Marketing Executives (TMEs) & field sales personnel, namely, Direct Sales Executives (DSEs) or Business Development Executives (BDEs) must agree to abide by this code prior to undertaking any direct marketing operation on behalf of the bank. Any TME/DSE found to be violating this code may be blacklisted and such action taken be reported to the bank from time to time by the DSA. Failure to comply with this requirement may result in permanent termination of business other DSA with HDFC bank and may even lead to permanent blacklisting by the industry.
A declaration to be obtained from TM Es and DSEs by the DSAs before assigning them their duties is annexed to this Code.
    `,
    { ...regularTextOption }
  );

pdfDoc.moveDown(1);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text(`2.0 Tele-calling a Prospect (a prospective customer)`, {
    ...subHeadingTextOption,
  });
pdfDoc
  .font(`${interRegular}`, 10)
  .fillColor("#000000")
  .text(
    `A prospect is to be contacted for sourcing a bank product or bank related product only under the following circumstancese`,
    { ...regularTextOption }
  );

const items = [
  "When prospect has expressed a desire to acquire a product through the banks Internet site/call center/Branch or through the Relationship Manager at the bank or has been referred to by another prospect/customer or is an existing customer of the Bank who has given consent for accepting calls on other products of the bank.",
  "When the prospects name/telephone no/ address is available & has been taken from one of the lists/directories/databases approved by the DSA Manager/Team leader, after taking his/ her consent and DNC registry de-dupe.",
  "The TME should not call a person whose name/number is flagged in 'Do not Call' Registry of the bank.",
];

pdfDoc.font(`${interRegular}`, 10).list(items, { ...listOptions });

pdfDoc.moveDown(1);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text(`3.0 When you may contact prospect on telephone`, {
    ...subHeadingTextOption,
  });
pdfDoc
  .font(`${interRegular}`, 10)
  .fillColor("#000000")
  .text(
    `Telephonic contact must normally be limited between 0930 Hrs. and 1900 Hrs. However, it may be ensured that a prospect is contacted only when the call is not expected to inconvenience him/her.
Calls earlier or later than the prescribed time period may be placed only under the following conditions:`,
    { ...regularTextOption }
  );

const itemsContactProspect = [
  "When the prospect has expressly authorized TME/DSE to do so either in writing",
  "Or orally",
];
pdfDoc
  .font(`${interRegular}`, 10)
  .list(itemsContactProspect, { ...listOptions });

pdfDoc.moveDown(1);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text(`4.0 Can the prospect's interest be discussed with anybody else?`, {
    ...subHeadingTextOption,
  });
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "DSA should respect a prospects privacy. The prospect's interest may normally be discussed only with the prospect and any other individual/family member such as Prospect's accountant/secretary /spouse, authorized by the prospect" +
      "4.1 Leaving messages and contacting persons other than the prospect.Calls must first be placed to the prospect.In the event the prospec IS not available, a message may be left for him/her. The aim of the message should be to get the prospect to return the call or to check for a convenient time to call again. Ordinarily, such messages may be restricted to" +
      "4.2 'Please leave a message that XXXXX (Name of officer) representing HDFC BANK called and requested to call back at ZZZZZZ (phone number) ' " +
      "As a general rule, the message must indicatee",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .list(
    [
      "That the purpose of the call is regarding selling or distributing a bank product Of HDFC BANK.",
    ],
    { ...listOptions }
  );

pdfDoc.moveDown(1);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text(`5.0 No misleading statements/misrepresentations permitted`, {
    ...subHeadingTextOption,
  });
pdfDoc
  .font(`${interRegular}`, 10)
  .text("TME/DSE should not -", { ...regularTextOption });
const misleadingSatementList = [
  "Mislead the prospect on any service / product offered;",
  "Mislead the prospect about their business or organization's name, or falsely represent themselves.",
  "Make any false / unauthorized commitment on behalf of HDFC BANK for any facility/service.",
];
pdfDoc
  .font(`${interRegular}`, 10)
  .list(misleadingSatementList, { ...listOptions });

pdfDoc.moveDown(1);
pdfDoc.font(`${interSemiBold}`, 10).text(`6.0 Telemarketing Etiquettes`, {
  ...subHeadingTextOption,
});
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("PRE CALL", { ...subHeadingTextOption });
const telemarketingPreCall = [
  "No calls prior to 0930 Hrs. or post 1900 Hrs. unless specifically requested.",
  "No serial dialing",
  "No calling on lists unless list is cleared by team leader",
];
pdfDoc
  .font(`${interRegular}`, 10)
  .list(telemarketingPreCall, { ...listOptions });
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("DURING CALL", { ...subHeadingTextOption });
const telemarketingDuringCall = [
  "Identify yourself, your company and your principal",
  "Request permission to proceed",
  "If denied permission, apologize and politely d disconnect.",
  "State reason for your call - Always offer to call back on landline, if call is made to a cell number",
  "Never interrupt or argue",
  "To the extent possible, talk in the language which is most comfortable to the prospect",
  "Keep the conversation limited to business matters",
  "Check for understanding of ' Most Important Terms and Conditions ' by the customer if he plans to buy the product - Reconfirm next call or next visit details",
  "Provide your telephone no, your supervisor's name or your bank officer contact details if asked for by the customer.",
  "Thank the customer for his/her time",
];
pdfDoc
  .font(`${interRegular}`, 10)
  .list(telemarketingDuringCall, { ...listOptions });
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("POST CALL", { ...subHeadingTextOption });
const telemarketingPostCall = [
  "Customers who have expressed their lack of interest for the offering should not be called for the next 3 months with the same offer",
  "Provide feedback to the bank on customers who have expressed their desire to be flagged 'Do Not Disturb'",
  "Never call or entertain calls from customers regarding products already sold. Advise them to contact the Customer Service Staff of the bank.",
];
pdfDoc
  .font(`${interRegular}`, 10)
  .list(telemarketingPostCall, { ...listOptions });

pdfDoc.moveDown(1);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("7.0 Gifts or bribes", { ...subHeadingTextOption });
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "TME/DSEs must not accept gifts from prospects or bribes of any kind. Any TME/DSE offered a bribe or payment of any kind by a customer must report the offer to his/her management.",
    {
      ...regularTextOption,
    }
  );

pdfDoc.moveDown(1);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("8.0 Precautions to be taken on visits/ contacts DSE shoulde", {
    ...subHeadingTextOption,
  });

const visitsPrecautions = [
  "Respect personal space - maintain adequate distance from the prospect.",
  "Not enter the prospect's residence/office against his/her wishes;",
  "Not visit in large numbers —i.e. not more than one DSE and one supervisor, if required. Respect the prospect's privacy.",
  "If the prospect is not present and only family members/office persons are present at the time of the visit, he/she should end the visit with a request for the prospect to call back.",
  "Provide his/her telephone number, supervisor’s name or the concerned bank officer's contact details, if asked for by the customer.",
  "Limit discussions with the prospect to the business — Maintain a professional distance.",
];
pdfDoc.font(`${interRegular}`, 10).list(visitsPrecautions, { ...listOptions });

pdfDoc.moveDown(1);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("9.0 Other important aspects - Appearance & Dress Code", {
    ...subHeadingTextOption,
  });

const appearanceDressCode = [
  "DSPs must be appropriately dressed — For men this means",
  "- Well ironed trousers;",
  "- Well ironed shirt, shirt sleeves preferably buttoned down.",
  "For women this means",
  "- Well ironed formal attire (Saree, Suit etc.)",
  "- Well groomed appearance. (Jeans and/or T Shirt, open sandals are not considered appropriate under formal attire)",
];
pdfDoc.font(`${interRegular}`, 10).text(appearanceDressCode[0], {
  ...regularTextOption,
});
pdfDoc.font(`${interRegular}`, 10).text(appearanceDressCode[1], {
  ...regularTextOption,
});
pdfDoc.font(`${interRegular}`, 10).text(appearanceDressCode[2], {
  ...regularTextOption,
});
pdfDoc.font(`${interRegular}`, 10).text(appearanceDressCode[3], {
  ...regularTextOption,
});
pdfDoc.font(`${interRegular}`, 10).text(appearanceDressCode[4], {
  ...regularTextOption,
});

pdfDoc.moveDown(1);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("10.0 Handling of letters & other communication", {
    ...subHeadingTextOption,
  });
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "Any communication sent to the prospect should be only in the mode and format approved by the Bank.",
    {
      ...regularTextOption,
    }
  );
pdfDoc.moveDown(2);
pdfDoc
  .font(`${interRegular}`, 10)
  .text("I / We have read and understood and accept the same.", {
    ...regularTextOption,
  });

pdfDoc.moveDown(6);
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "Starpowerz Digital Technologies Pvt. Ltd                            ",
    {
      ...regularTextOption,
      ...continueOption,
    }
  );
pdfDoc
  .font(interRegular, 10)
  .text("Digi Team Member", { ...regularTextOption });

pdfDoc.moveDown(4);
pdfDoc.image("assets/contactInfo.png", { width: pageWidth - 150 });

pdfDoc.moveDown(4);
pdfDoc.font(`${interSemiBold}`, 10).text("Starpowerz Digiloans", {
  ...subHeadingTextOption,
  align: "center",
});

pdfDoc
  .font(`${interRegular}`, 9)
  .text(
    "5-9-30/5/204, Paigah Plaza, Basheerbagh, Hyderabad, Telangana - 500063",
    { ...regularTextOption, align: "center" }
  );

// PDF Kit
pdfDoc.pipe(fs.createWriteStream("digiloans.aggrement.pdf"));
pdfDoc.end();

// should be before passport
server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

server.use(passport.initialize());

server.use(passport.session());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // limit each IP to 100 requests per 15 minutes
  message: "Too many requests from this IP, please try again later",
  statusCode: 429,
});

// Apply the rate limiter middleware to all requests
server.use(limiter);

server.listen(PORT, () => {
  console.log(`Backend Server running on PORT: [${PORT}]`);
});

// Swagger
server.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

server.use(express.json());
server.use(express.urlencoded({ extended: true, limit: "500mb" }));

// Mongo
const mongoUrl = getUrl();
console.log("mongoUrl", mongoUrl);
mongoose
  .connect(mongoUrl, {
    authSource: "admin",
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log("Failed to connect to Database:\n" + err));
const db = mongoose.connection;
db.on("open", () => {
  console.log("Connection established.");
});

require("./routes")(server);

// Response for Non existant routes
server.use("*", (req, res) => {
  console.log("req.url", req.url);
  const message = "You reached a route that is not defined on this server.";
  return res.status(404).json({
    message,
  });
});
