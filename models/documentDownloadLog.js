const mongoose = require("mongoose");
const { Schema } = mongoose;

const documentsDownloadLogSchema = new Schema({
  documentId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  downloadedDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const DocumentsDownloadLog = mongoose.model("documents_download_log", documentsDownloadLogSchema);

exports.createDocumentsDownloadLog = async ({ document }) => {
  await DocumentsDownloadLog.create({ documentId: document._id });
};

exports.getDocumentsDownloadLogMongo = async ({ limit, sort }) => {
  const pipeline = [
    {
      $lookup: {
        from: "documents",
        localField: "documentId",
        foreignField: "_id",
        as: "document",
      },
    },
    {
      $unwind: { path: "$document" },
    },
    {
      $project: {
        _id: 0,
        downloadedDate: "$downloadedDate",
        name: "$document.name",
        category: "$document.category",
      },
    },
    {
      $sort: sort,
    },
    {
      $limit: Number(limit),
    },
  ];
  return await DocumentsDownloadLog.aggregate(pipeline);
};
