import express from 'express'
import multer from 'multer'
import {
    Projects
} from '../models'
const Router = express.Router();
const Upload = multer()
import { removeEmptyOrNull } from '../helpers/removeEmptyOrNull'

Router.get('/', (req, res) => {
    return res.render("Home")
})

Router.get('/add', (req, res) => {
    return res.render("Add")
})

Router.post('/add', Upload.single('projectPhoto'), async (req, res) => {
    const { title, desc } = req.body;
    const projectPhoto = req.file;

    if(title && desc && projectPhoto){
        var createdProject = await Projects.create({
            title: title,
            desc: desc,
            photo: projectPhoto.buffer,
            mimetype: projectPhoto.mimetype
        })
        return res.status(200).json({isSuccess: true, data: createdProject})
    }
    return res.status(404).json({isSuccess: false, message: "Parameters wrong or missing!"})
})

Router.post('/delete', async (req, res) => {
    const { projectId } = req.body;

    if(projectId){
        var deletedProject = await Projects.findByIdAndRemove(projectId);
        return res.status(200).json({isSuccess: true, data: deletedProject})
    }
    return res.status(404).json({isSuccess: false, message: "Parameters wrong or missing!"})
})

Router.post('/update', async (req, res) => {    
    const { projectId, title, desc} = req.body;

    if(projectId && (title || desc)){
        var data = {
            title: title,
            desc: desc
        }
        var willUpdateData = removeEmptyOrNull(data);
        var updatedProject = await Projects.findByIdAndUpdate(projectId, willUpdateData, { new: true})
        return res.status(200).json({isSuccess: true, data: updatedProject})
    }
    return res.status(404).json({isSuccess: false, message: "Parameters wrong or missing!"})
})

Router.get('/portfolio', async (req, res) => {
    var projects = await Projects.find();
    res.locals = {
        projects
    }
    return res.render("Portfolio")
})

Router.get('/about', (req, res) => {
    return res.render("About")
})

Router.get('/contact', (req, res) => {
    return res.render("Contact")
})


export default {
    path: '/',
    router: Router
};