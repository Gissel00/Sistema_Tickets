const mongoose = require("mongoose");

const files = new mongoose.Schema(
  {
    ticket         : { type: Number, ref: 'tickets', defualt: null},
    gDriveFileId : { type: String, defualt: null, unique: true },
    fileNameAndExtension : { type: String, default: null },
    fileContentType : { type: String, default: null }
  },
  {
    timestamps: 
      {
        createdAt: "creado_a",
        updatedAt: "actualizado_a"
      }
  }
);

module.exports = mongoose.model("files", files);