var _ = require('underscore');
require('underscore_extended');
//var hub = require('messagehub');

exports = function smart_job(hub,name){
  const job_name = name;
  const finished_job_name = 'finished '+ job_name;
  console.log('setting up job poster for:', job_name);
  return {
    name:job_name,
    post:function(job){
      const posted_job = job || {};
      console.log('posting job:',job_name, posted_job);
      hub.job(job_name,posted_job);
    },
    response:function(job_finished){       //a response to a finished job
      console.log('setting up response listener for:', finished_job_name);
      hub.worker(finished_job_name, function(response,done){
        console.log('acknowledging finished job', job_name);
        job_finished(response,done);
      });
    },
    no_response:function(){
      this.response(function(resp,done){done()});
    },
    worker:function(job_finished){ //after all work is finished, a proper
      //response should be issued that will be caught by the
      //'response' function
      console.log('setting up worker for:', job_name);
      var worker = this;
      hub.worker(job_name, function(job,done){

        function done_job(response){
          done();//tell rabbit that we are done with the current queue
          //item
          const job_message = response ? _.combine(job,response) : job;
          console.log('issuing response for job', job_message);
          hub.job(finished_job_name,job_message);
        }         

        console.log('finished job', job_name);
        job_finished(job,done_job);
      });
    }
  } 
}
