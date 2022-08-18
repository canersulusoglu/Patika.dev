import express from 'express'
import multer from 'multer'
import {
    Photos
} from '../models'
const Router = express.Router();
const Upload = multer()
import { removeEmptyOrNull } from '../helpers/removeEmptyOrNull'

Router.get('/', async (req, res) => {
    var photos = await Photos.find();
    res.locals = {
        photos
    }
    return res.render("Home")
})

Router.get('/add', (req, res) => {
    res.render("Add")
})

Router.get('/edit/:photoId', async (req, res) => {
    const { photoId } = req.params;
    
    if(photoId){
        var photo = await Photos.findById(photoId);
        if(photo){
            res.locals = {
                photo
            }
            return res.render("Edit")
        }
        return res.redirect("/")
    }
    return res.redirect("/")
})


Router.post('/add', Upload.single('photo'), async (req, res) => {
    const { title, desc} = req.body;
    const photo = req.file;

    if(title && desc && photo){
        var createdPhoto = await Photos.create({
            title: title,
            desc: desc,
            photo: photo.buffer,
            mimetype: photo.mimetype
        })
        return res.status(200).json({isSuccess: true, data: createdPhoto})
    }
    return res.status(404).json({isSuccess: false, message: "Parameters wrong or missing!"})
})


Router.post('/delete', async (req, res) => {
    const { photoId } = req.body;

    if(photoId){
        var deletedPhoto = await Photos.findByIdAndRemove(photoId);
        return res.status(200).json({isSuccess: true, data: deletedPhoto})
    }
    return res.status(404).json({isSuccess: false, message: "Parameters wrong or missing!"})
})


Router.post('/update', async (req, res) => {    
    const { photoId, title, desc} = req.body;

    if(photoId && (title || desc)){
        var data = {
            title: title,
            desc: desc
        }
        var willUpdateData = removeEmptyOrNull(data);
        console.log(willUpdateData)
        var updatedPhoto = await Photos.findByIdAndUpdate(photoId, willUpdateData, { new: true})
        return res.status(200).json({isSuccess: true, data: updatedPhoto})
    }
    return res.status(404).json({isSuccess: false, message: "Parameters wrong or missing!"})
})

export default {
    path: '/',
    router: Router
};