import express from 'express'
const Router = express.Router();

Router.get('/mainPage', (req, res) => {
    res.send("mainpage hello")
})

export default {
    path: '/',
    router: Router
};