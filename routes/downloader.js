const PexelsAPI = require('pexels-api-wrapper');
const wget = require('node-wget');
const fs = require('fs');

//Create Client instance by passing in API key

 
//Search API
class downloader{


static downloadImage(imageName){
let pexelsClient = new PexelsAPI("563492ad6f917000010000016e56d9dc7b6547fb9c98d3d27b9d401e");
pexelsClient.search(imageName, 10, 1)
    .then(function(result){
        console.log(result);
        let photos = result.photos;
        for(let i = 0; i < photos.length;i++){
            let id = photos[i].id;
            pexelsClient.getPhoto(id)
            .then(function(result){
                console.log(result);
                let url = result.src.small;
                console.log(url);
                wget({url: url, dest: "images/"+imageName + "_" + i +".png"}, function (error, response, body) {
                    if (error) {
                        console.log('--- error:');
                        console.log(error);            // error encountered
                    } else {
                        console.log('--- headers:');
                        console.log(response.headers); // response headers
                     
                    }
                });
            }).
            catch(function(e){
            console.err(e);
            });
         
        }

    }).
    catch(function(e){
        console.err(e);
    });

}

static getImageUrl(imageName,res){
    let pexelsClient = new PexelsAPI("563492ad6f91700001000001deb9dbd38875466396ea2db682d70e17");
    pexelsClient.search(imageName, 10, 1)
        .then(function(result){
            console.log(result);
            let photos = result.photos;
            let urls = [];
            for(let i = 0; i < photos.length;i++){
                let id = photos[i].id;
                pexelsClient.getPhoto(id)
                .then(function(result){
                    console.log(result);
                    let url = result.src.small;
                    url = {url:url};
                    return res.status(200).json(url);
                   // urls.push(url);
                }).
                catch(function(e){
                console.err(e);
                });
             
            }

            
    
        }).
        catch(function(e){
            console.err(e);
        });
    
    }
    
}
module.exports = downloader;

 