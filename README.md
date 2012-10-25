Smart Jobs
==========

This is a small wrapper over messagehub.js that adds queue callbacks for jobs.

example use:
````
var image_processing_hub = hub(args.rabbitmq,'simple.image.processing');
var image_processing_job = smart_job(image_processing_hub,'process pdf');
var image_processing_done = smart_job(image_processing_hub,'done with doc');
````

in the above example we create a hub via message hub, this sets the rabbitMQ config and gives our messages a namespace of 'simple.image.processing'

when we create a smart job ```image_processing_job``` it generates further name spaces 'process pdf' and 'finished process pdf'

Posting Jobs
------------
````
image_processing_done.post(job);
````
the above is an example of what one would do when they want to post a job. in this case the job is being posted to 'done with doc' queue in the 'simple.image.processing. name-space.

Working on Jobs
---------------
````
image_processing_job
  .worker(function(job,done){...})
````
setting up a worker is just like message hub, minus the name-space. the done function takes a response message that is sent to the issuer of the job.

Responding to finished Jobs
---------------------------
````
image_processing_job
     .response(function(job_response,done){...});
````
The response is used when listening to a finished job. The job_response argument is sent via the worker that finished the job. otherwise ```.response``` is the same as ```.worker``` except that it's ```done``` callback doesn't take arguments.