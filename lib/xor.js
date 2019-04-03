var xor = (function xor_preloader(){




return {
	filemanager:{
		files:[],
		readers:[],
		addFilesFromInput:function(inputDom){
			for(var i=0;i<inputDom.files.length; i++)
				this.addFile(inputDom.files[i]);
			return inputDom.files.length;
		},
		addFile:function(file,start=0,length=-1){
			var subfile = file.slice(start,length);
			var index = this.files.push(subfile) - 1;
			this.readers.push(new FileReader());
		},
		readSlice:function(iFile,start,end){
			var filemanager = this;
			if(this.files.length>iFile){
				return new Promise(function(resolve,reject){
					var slice = filemanager.files[iFile].slice(start, end);
					filemanager.readers[iFile].onabort = filemanager.readers[iFile].onerror = function(event){
						reject(event);
					}
					filemanager.readers[iFile].onload=function(event){
						resolve(event.target.result);
					}
					filemanager.readers[iFile].readAsArrayBuffer(slice);
				});
			}
			return Promise.reject(new Error('invalid file index'));
		},
	},


	controller:{
		chunksize:4096,
		workers:[],
		init:function(){
			console.log("xor controller init");
		},

		addWorker:function(){
			var worker_source = "("+xor_preloader.toString()+")()";
			var worker = new Worker(
				URL.createObjectURL(
					new Blob(
						[worker_source],
						{type: 'text/javascript'}
					)
				)
			);
			var worker_id = this.workers.push(worker)-1;
			console.log(this.workers);
			console.log(xor.controller.workers);
			this.sendWork(worker_id,'setid',worker_id);
			this.sendWork(worker_id,'setbufsize',this.bufsize);
			return worker_id;
		},
		sendWork:function(iWorker,command,data){
			if(iWorker==='*'){
				this.workers.forEach( (value,index) => this.sendWork(index,command,data) );
			}else{
				if(this.workers.length>iWorker){
					console.log("C => "+iWorker+": "+command);
					this.workers[iWorker].postMessage({
						command:command,
						contents:data
					});
				}
			}
		},
		setChunkSize:function(n){
			this.bufsize=n;
			this.sendWork('*','setbufsize',this.chunksize);
		}
	},

	worker:{
		states:{NONE:0,NOTREADY:1,READY:2,BUSY:3,WORKING:4},
		queue:[],
		views:[],
		buffers:[],
		state:0,
		id:null,
		init:function(){
			console.log("xor worker init");
			this.initlistener();
			this.state=this.states.READY;
			this.initworkflow();
		},
		initlistener:function(){
			worker = this;
			addEventListener('message',function(evt){
				worker.queue.push(evt.data);
			},false);
		},
		initworkflow:function(){
			worker = this;
			setInterval(function(){
				if(worker.queue.length>0){
					worker.state = worker.states.WORKING;
					worker.handlework(worker.queue.shift());
					if(worker.queue.length==0){
						worker.state = worker.states.READY;
					}else{
						worker.state = worker.states.BUSY;
					}
				}
			},250);
		},
		handlework:function(work){
			switch(work.command){
				case 'setid':
					this.id=work.contents;
					break;
				case 'setbufsize':
					this.buffer=new Uint8Array(work.contents);
					break;
				case 'debug':
					console.log('XOR-WORKER-'+this.id+': '+work.contents);
					break;
				case 'reset':
					break;
				case 'addview':
					this.views.push(work.contents);
					break;
				case 'testdataview':
					console.log("WORKER: "+work.dv.getInt8(0));
					break;
			}
			console.log(this.id+" <= C: "+work.command);
		}
	},
	isworker:function(){
		return (self.toString().indexOf('Worker') != -1);
	},
	init:function(){
		if(this.isworker()){
			this.worker.init();
		}else{
			this.controller.init();
		}
		return this;
	}
}.init();


})();




