import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/filteredimage", async ( req: express.Request, res: express.Response) => {
    try {
      // 1. validate the image_url query
      const imageUrl: string = req.query.image_url as string;
      if (!imageUrl) {
        throw Error();
      }
      const fetchData = await fetch(imageUrl.toString(), { method: 'GET' });
      if(fetchData.status !== 200) {
        throw Error();
      }
      // 2. call filterImageFromURL(image_url) to filter the image
      const imagePath: string = await filterImageFromURL(imageUrl);

      // 3. send the resulting file in the response
      res.sendFile(imagePath);

      // 4. deletes any files on the server on finish of the response
      setTimeout(() => {
        deleteLocalFiles([imagePath]);
      }, 5000);

    } catch (error) {
      res.status(400).send({"msg": error.toString()});
    }
  });
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();