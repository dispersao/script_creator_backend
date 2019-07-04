const padStart = require('lodash/padStart');
const isNaN = require('lodash/isNaN');
const ffmpeg = require('ffmpeg');

const includeSeqTime = async (seqs)=>{
  let videosFolder = __dirname + '/' + process.env.VIDEOS_FOLDER;

  let promises = seqs.map(seq => {
    let padCount = isNaN(Number(seq.sceneNumber.slice(-1))) ? 4 : 3;
    let fileName = padStart(seq.sceneNumber, padCount, '0');
    let videoFile = `${videosFolder}/${fileName}.mov`;

    let p;
    try{
      let process = new ffmpeg(videoFile);
      p = process.then(video => {
        video.fnExtractFrameToJPG(`${videosFolder}/photos`, {
          frame_rate : 1,
          start_time: 5,
          number : 1,
          file_name : `${fileName}`
        }, (error, files) => {
          if(error) console.log(error)
          // else console.log(files)
        })
        return video.metadata.duration.seconds
      }).catch(e => {
        console.dir(seq.sceneNumber, e)
      })
    } catch(e){
      console.log(seq.sceneNumber, e)
    }
    return p;
  })
  let seconds = await Promise.all(promises)
  seqs.forEach((s,index) => {
    if(seconds[index]){
      s.duration = seconds[index]
    }
  })

  return seqs;
}

module.exports = includeSeqTime
