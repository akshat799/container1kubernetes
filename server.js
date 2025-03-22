const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 6000
const URL = "http://container2-service:8000/"
const STORAGE_PATH = "/akshat_PV_dir";

app.use(express.json());



app.post('/store-file', async(req,res) => {
    const {file, data} = req.body;

    if(!file){
        return res.status(400).json(
            {
                "file": null,
                "error": "Invalid JSON input."
            }
        )
    }

    try{
        const filePath = path.join(STORAGE_PATH, file);
        const formattedData = data.replace(/, /g, ',').replace(/\\n/g, '\n')
        fs.writeFile(filePath,formattedData, (err) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    file: file,
                    error: "Error while storing the file to the storage."
                })
            }

            res.json({
                file: file,
                message: 'Success.'
            })
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            file: file,
            error: "Error while storing the file to the storage."
        })
    }

})

app.post('/calculate', async(req,res) => {
    const {file, product} = req.body;
    if(!file){
        return res.status(400).json(
            {
                "file": null,
                "error": "Invalid JSON input."
            }
        )
    }
    const filePath = path.join(STORAGE_PATH, file);
    if (!fs.existsSync(filePath)){
        return res.status(404).json(
            {
                "file": file,
                "error": "File not found."
            }
        )
    }

    try{
        const response = await axios.post(URL, {
            file,
            product
        })

        const {error, sum, status} = response.data;

        if(error){
            return res.status(status).json(
                {
                    "file": file,
                    "error": error
                }
            )
        }

        return res.json(
            {
                "file": file,
                "sum": sum
            }
        )
        
    }catch(e){
        console.log(e);

    }
})
//this is just a test
app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));