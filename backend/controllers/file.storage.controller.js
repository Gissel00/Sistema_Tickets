const stream = require('stream');
const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');
const configs = require('../gdrive/config');
const authenticator = require('../gdrive/index');
const fileStorageModel = require('../models/files.storage.model');

exports.uploadFile = async (req, res) => {
  const { ticket } = req.body;
  if(!ticket) return res.status(500).send({message: "El ID del ticket es requerido."});
  try{
  const fileObject = req.files[0];
  const auth = await authenticator.authorize();
  const service = google.drive({version: 'v3', auth});
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  const { data } = await service.files.create({
    media: {
      mimeType: fileObject.mimetype,
      body: bufferStream,
    },
    requestBody: {
      name: fileObject.originalname,
      parents: [configs.keys.folderId],
    },
    fields: 'id,name',
  });
  await fileStorageModel.create({
    ticket: parseInt(ticket),
    fileContentType: fileObject.mimetype,
    fileNameAndExtension: fileObject.originalname,
    gDriveFileId: data.id
  }).then(()=>{
    res.status(201).send({message: "Se subio el archivo exitosamente."});
  }).catch(err=>{
    console.log(err);
    res.status(500).send({message: "Hubo un error no se pudo guardar el archivo."})
  });
  }catch(err){
    res.status(500).send({message: err});
  }
};

exports.downloadFile = async function (req, res) {
  const id = req.params.id;
  try{
    const auth = await authenticator.authorize();
    const service = google.drive({version: 'v3', auth});
    const fileInStorage = await fileStorageModel.findOne({_id: id}).lean().exec();
    await service.files.get(
      { fileId: fileInStorage.gDriveFileId, alt: 'media'},
      { responseType: 'arraybuffer' }
    ).then(content => {
      res.set({
        'Content-Type': 'application/octet-stream ',
        'Content-Disposition': `attachment; filename="${fileInStorage.fileNameAndExtension}"`,
        'Cache-Control' : 'private'
      })
      .status(content.status)
      .send(Buffer.from(content.data));
    }).catch(err =>{
      console.log(err);
      res.status(500).send({error: err, message: "No se pudo obtener el archivo."})
    });
  } catch(err){
    console.log(err);
    res.status(500).send({message: "No se encontro el archivo."}); 
  }
};

exports.downloadProfileImg = async function(req, res) {
  const id = req.params.id;
  try{
    const auth = await authenticator.authorize();
    const service = google.drive({version: 'v3', auth});
    await service.files.get(
      { fileId: id, alt: 'media'},
      { responseType: 'arraybuffer' }
    ).then(content => {
      res.set({
        'Content-Type': 'application/octet-stream ',
        'Content-Disposition': `attachment; filename="img.jpg"`,
        'Cache-Control' : 'private'
      })
      .status(content.status)
      .send(Buffer.from(content.data));
    }).catch(err =>{
      console.log(err);
      res.status(500).send({error: err, message: "No se pudo obtener el archivo."})
    });
  } catch(err){
    console.log(err);
    res.status(500).send({message: "No se encontro el archivo."}); 
  }
}

exports.getListOfFiles = async (req, res) =>{
  const id = req.params.id;
  await fileStorageModel.find({ticket: id}).then(data => {
    res.status(201).send(data);
  })
  .catch(err =>{
    res.status(500).send({message: "No se pudo obtener la lista de archivos."})
  });
}