import express, { Request, Response } from "express"





///jah'swill////////////////////////////////////
export async function createTeam(req: Request, res: Response){
  const { projectId }  = req.params
  //check for project using Id
  // const project = Projects.findOne({ projectId})
  let project; //templine
  if(project){
    const { teamName, about, teamMembers } = req.body
    const teamSchema = 
      Joi.object({
      teamName: Joi.string().trim().required(),
      about: Joi.string().trim().required(),
      teamMembers: Joi.array(),//making this fiels not required so an empty array can be stored in DB,    
    });
    try {
        const inputValidation = await teamSchema.validate(req.body, {
          abortEarly: false, ///essence of this line
        })
        if(inputValidation.error) {
            console.log("validation error")
            res.status(400).json ({
              message: "Invalid input, check and try again",
              error: inputValidation.error
            })
            return;
        }
        

    }catch(err){
      res.json({
        message: err
      })
    }

  }
} 
