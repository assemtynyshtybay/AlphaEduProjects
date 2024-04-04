const replaceTemp = (temp, object) => {
  let pageTemp = temp.replace(/{%QUESTION%}/g, object.question);
  pageTemp = pageTemp.replace(/{%ANSWER%}/g, object.answer);
  pageTemp = pageTemp.replace(/{%QUESTION_ID%}/g, object.question_id);
  return pageTemp;
};
export default replaceTemp;
