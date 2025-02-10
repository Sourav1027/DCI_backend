// controllers/remarksController.js
const Remarks = require('../model/enquiry/remarks');
const Enquiry = require('../model/enquiry/enquiry');

exports.addRemarks = async (req, res) => {
  try {
    const { remarks } = req.body;
    const { enquiryId } = req.params;
    
    // Get the enquiry to fetch counsellor name
    const enquiry = await Enquiry.findByPk(enquiryId);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    const newRemarks = await Remarks.create({
      enquiryId,
      remarks,
    });

    res.status(201).json({
      success: true,
      data: newRemarks
    });
  } catch (error) {
    console.error('Error adding remarks:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding remarks',
      error: error.message
    });
  }
};

exports.getRemarksHistory = async (req, res) => {
  try {
    const { enquiryId } = req.params;

    const remarksHistory = await Remarks.findAll({
      where: { enquiryId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: remarksHistory
    });
  } catch (error) {
    console.error('Error fetching remarks history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching remarks history',
      error: error.message
    });
  }
};
