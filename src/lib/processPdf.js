import * as PDFJS from "pdfjs-dist/build/pdf";
import {
  PassRegex, FailRegex, FailGtFiveRegex, FailGtTwoRegex, RemoveFirstAndLastCharRegex
} from '../constants/regex'


 
 
 export const getPDFDoc = async (pdfUrl, {all = false, startPage = 1, endPage = 10}) => {
    const allResults = [];
    let start = all ? 1 : startPage;
    
    const doc = await PDFJS.getDocument(pdfUrl);
    // document is loaded, 
    
    try{

         /**
               * you can now use *loadedPdf* here
               * loadedPdf is an object with the following properties:
               *  - numPages
               * - fingerprint
               * - numRender
               * getPage(pageNumber)
               * etc ...
               */
        const loadedPdf = await doc.promise

        const end = all ? loadedPdf.numPages : endPage;
      
      
    
              /**
               * loop through all pages and get the text content of each page
               *  - getPage(pageNumber) returns a promise that resolves with a page object
               * - page.getTextContent() returns a promise that resolves with an object that has the following properties:
               * - items
               * - styles
               * -  - str
               * -  - dir 
               * -  - width 
               * and more ...
               */
              for(let page = start; page <= end; page++) {


                try{

                    const pdfPage = await loadedPdf.getPage(page);

                    

                    /**
                   * you can now use *page* here 
                   * textContent is a promise that resolves with an object that has the following properties:
                   * - items
                   * - styles
                   * -  - str
                   */
      
                  const textContent = await pdfPage.getTextContent();
                   
                 
                  /** 
                   *  next line is important, you need to wait until page.getTextContent() resolves with the text content 
                   * text is an array of objects, each object represents a line of text on the page
                   * each object has the following properties:  
                   * - str
                   * - dir
                   * - width
                   * - height
                   */

                  const resultArr = [];

                  for(let i = 0; i < textContent.items.length; i++){


                    const currentString = (textContent.items && textContent.items[i]) ? textContent.items[i]?.str : null;
    
                    /**
                     * - str is the text content of the line 
                     * the next line is a regex that checks if this student has failed more than 5 subjects 
                     * if so, we skip this line and continue to the next line
                     */
    
                    if(!currentString || !(typeof currentString === 'string')) continue;
    
                    if(typeof currentString === 'string'){
                      if(FailGtFiveRegex.test(currentString)  ){
                        // console.log(currentString)
                        continue;
                      }
      
                      /**
                       * the next line is a regex that checks if this student has failed more than 2 subjects
                       * if so, we check if the next line has the number of subjects failed
                       * if so, we add the next line to the current line and push it to the result array
                       */
          
                     else if(FailGtTwoRegex.test(currentString)){
      
                      /**
                       * the next line is a regex that checks if student has failed more than 5 subjects 
                       * then we add the next two lines to the current line and push it to the result array 
                       * 
                       */
          
                        if(FailGtFiveRegex.test(textContent.items[i+1]?.str)){
          
                          const fullString = currentString + ' ' + textContent.items[i+1]?.str + ' ' +  textContent.items[i+2]?.str
                          resultArr.push(fullString)
          
                        }
      
                        /**
                         * the next line is a regex that checks if student has failed more than 2 subjects
                         * then we add the next line to the current line and push it to the result array
                         */
                        
                        else{
                          const fullString  =  currentString + ' ' + textContent.items[i+1]?.str
                          resultArr.push(fullString)
                        }
      
                      }
                      
                      /**
                       * the next line condition checks if the student has failed at least one subject 
                       * if so, we push the current line to the result array
                       * 
                       */
                      
                      else if(FailRegex.test(currentString)){
                        resultArr.push(currentString)
                      }
      
                      /**
                       * the next line condition checks if the student has passed all subjects
                       * if so, we push the current line to the result array
                       */
                      
                      else if(PassRegex.test(currentString)){
                        resultArr.push(currentString)
                      }
                    }else{
                      continue;
                    }
        
                    
                  } // end of single page all lines for loop 
      
                  
                  allResults.push(...resultArr)


                }catch(err){
                    alert('error detected')
                    console.log(err)
                }
      
    
      
              } // end all pages  for loop 

        

    }catch(err){
        console.log(err)
    }

    return allResults;


  };




  export const processForDatabase = (allResults) => {
    const resultObj = [];
    allResults.forEach(item =>{
          if(PassRegex.test(item)){
            const [roll, point] = item.split(' ')
            const finalPoint = point.replace(RemoveFirstAndLastCharRegex, "$1");

            resultObj.push({
              roll,
              cgpa: finalPoint
            })

          }else if(FailRegex.test(item)){
            const [roll, subjects] = item.split('{')
            const finalSubjects = subjects.replace(RemoveFirstAndLastCharRegex, "$1");
            resultObj.push({
              roll,
              fail_subjects: finalSubjects.split(', '),
              cgpa: 0

            })

          }
          
          
        })

        return resultObj;
  }