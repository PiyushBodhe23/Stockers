exports.getIndices = async (req, res) => {
  try {
    // You can enhance this to calculate from real data
    const indices = {
      nifty: { 
        value: 24123.45, 
        change: 187.30, 
        percent: 0.78 
      },
      sensex: { 
        value: 79243.67, 
        change: 456.23, 
        percent: 0.58 
      }
    };
    res.json(indices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};