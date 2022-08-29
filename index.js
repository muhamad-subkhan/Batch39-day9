const express = require("express")
const app = express()

const port = 8000;



app.set("view engine", "hbs") // set view engin hbs

app.use("/public", express.static(__dirname + "/public")) //static folder

app.use(express.urlencoded({extended: false}))

const db = require("./public/assets/connection/db")

let isLogin = true;


app.get("/", function (request, response){

    db.connect(function(err, client, done){
        if (err) throw err

        client.query("SELECT * FROM public.tb_projects", function(err, result){
            done()
            if (err) throw err
            let dataProject = result.rows
            let data = dataProject.map(function(items){
                return{
                    ...items,
                    duration: distanceTime(items.start_date, items.end_date)
                }
            })
            // console.log(dataProject[0]);
            response.render("index", {isLogin, dataProject: data})
        })
    })
})

app.get("/add-project", function(request, response){


    response.render("project")
})

app.post("/add-project", function(request, response){
  
    response.redirect("/")
})

app.get("/detail-project/:index", function (request, response){
   
    response.render("detail-project")
})

app.get("/update/:index", function(request, response){

    response.render("update")
})

app.post("/update/:index", function (request, response){
 
    response.redirect("/")

})




app.get("/delete/:index", function(request, response){
  
    response.redirect("/")
})

app.get("/contact-me", function(request, response){

    response.render("contact-me")
})


function fullTime(times) {

 let time = new Date(times)

    let month = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
    ]
    let date = time.getDate()
    let monthIndex = time.getMonth()
    let Year = time.getFullYear()

    return `${date} ${month[monthIndex]} ${Year}`
}






function distanceTime(startDate, endDate){


    let start = new Date(startDate)
    let end = new Date(endDate)

    let duration = end - start
    
    //miliseconds  1000
    //second in hours 3600 
    // hours in day 23 (karena ketika sudah sampai jam 23.59 akan kembali ke 00.00)
    // day in month 31

    let distanceDay = Math.floor(duration / (1000 * 3600 * 23));
    let distanceMonth = Math.floor(distanceDay / 31);
    let distanceMore = Math.floor(distanceDay % 31 - 1)

    
    if (distanceMonth <= 0) {
        return distanceDay + " Hari"
    } else 
        return distanceMonth + " Bulan " + distanceMore + " Hari"
    
}








app.listen(port, function(){
    console.log(`server berjalan pada port : ${port}`);
})