angular.module("companyDetailController", []).controller("companyDetailController", 
function($scope, $rootScope, $http, companyService, $window, $document, $timeout) {
	$scope.visible = false;
    $rootScope.visible_project = false;
	$rootScope.errName = false;
    $rootScope.projectName = "";
	$rootScope.project_err_msg = "";
	$rootScope.modal_class = "";
	$rootScope.startServerKeyRotation = false;
	$rootScope.stopServerKeyRotation = false;
	$rootScope.updateServerKey = false;
	$rootScope.projectId = "";
	var local_index = -1;
    var body = angular.element($document[0].body);
    //var projectPageDetailsUrl="";
    $scope.createStyle={display:'none'};
    var pCount = true;

	var id = companyService.getId();
	if(id == undefined || id == null){
	 	id = $window.localStorage.getItem('companyId');
	 	}
 	$window.localStorage.setItem('companyId', id);

// server polling starts 

var loadTime = 5000, //Load the data every second
    errorCount = 0, //Counter for the server errors
    loadPromise; //Pointer to the promise created by the Angular $timout service

	 var getData = function() {
	    $http({
		method : "post",
		url : "/getProjectPagedetails",
		headers : {"Content-Type" : "application/json"},
		data : {id : id}
		}).
		success(function(data) {
			$scope.company_name = data.company.companyName;
			$scope.company_notes = data.company.companyNotes;
            
			if(data.projects == null && pCount==true){
					$scope.createStyle={display:'block'};
					pCount=false;
				}


			for(var x in data.projects){
			var servers = [];
			data.projects[x].servers = [];
				for(var y in data.servers){
					if(data.servers[y].project_id == data.projects[x].id){
						servers.push(data.servers[y]);
						data.projects[x].servers = servers;
				    }
			    }
		    }
		    $scope.projects = data.projects;
			if($scope.projects == null){
				$scope.projects = [];
			}
			errorCount = 0;
			nextLoad();
		});

		
      };

	  var cancelNextLoad = function() {
	    $timeout.cancel(loadPromise);
	  };

	  var nextLoad = function(mill) {
	    mill = mill || loadTime;
	    
	    //Always make sure the last timeout is cleared before starting a new one
	    cancelNextLoad();
	    loadPromise = $timeout(getData, mill);
	  };

	  //Start polling the server by getData() first fetch url from properties file
	  //$http.get('environment.properties').then(function (response) {
        //projectPageDetailsUrl = response.data.projectPageDetailsUrl;
        getData();
        //});
	  
	  //Always clear the timeout when the view is destroyed, otherwise it will keep polling
	  $scope.$on('$destroy', function() {
	    cancelNextLoad();
	  });

// server polling ends
	
	$rootScope.setProjectId = function(id) {
		companyService.setId(id);
	};
		
	$rootScope.close = function(value) {
		if(value == "project_ok"){
			var pname = "";
			$rootScope.errName = false;
			pname = $rootScope.projectName;
			if(pname == undefined || pname.trim().length <= 0){
				$rootScope.errName = true;
				return;
			}else{
				$scope.errName = false;
				$http({
					method : "POST",
					url : "/createProject",
					data : {pname : pname.trim(), cid : companyService.getId()},
					headers : {"Content-Type" : "application/json"}
				}).
				success(function(data){
					if(data.success == 1){
						var result = {projectName: pname.trim(), id: data.row_id, company_id: companyService.getId()};
						$rootScope.visible_project = $rootScope.visible_project ? false : true;
						$scope.projects.push({projectName : result.projectName, id : result.id});
						var companydata = $rootScope.companies;
						for(var x in companydata){
							var projects = companydata[x].projects;
							if(result.company_id == companydata[x].id){
								projects.push(result);
								companydata[x].projects = projects;
							}
						}
		 				$rootScope.companies = companydata;
						body.removeClass("overflowHidden");
						$rootScope.modal_class = "";
					}else if(data.success == 0){
						$rootScope.project_err_msg = "Internal Error!";
					}
					else if(data.success == 2){
						$rootScope.project_err_msg = data.err_desc;
					}
			   });
			}
		}
		else if(value == "project_cancel"){
			$rootScope.visible_project = $rootScope.visible_project ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
		}
		
	};

	$scope.showOptions = function(index) {
		if(local_index != index){
			$scope.visible = false;
		}
		local_index = index;
		$scope.visible = $scope.visible ? false : true;
	};

	$scope.showProjectModal = function() {
		$rootScope.visible_project = $rootScope.visible_project ? false : true;
		$rootScope.errName = false;
		$rootScope.projectName = "";
		$rootScope.project_err_msg = "";
		if ($rootScope.visible_project) {
			body.addClass("overflowHidden");
			$rootScope.modal_class = "modal-backdrop fade in";
		} else {
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
		}
	};

	$scope.showPopup = function(mode, projectId) {
		if (mode == "createProject") {
			$rootScope.visible_project = $rootScope.visible_project ? false : true;
			$rootScope.errName = false;
			$rootScope.projectName = "";
			$rootScope.project_err_msg = "";
			if ($rootScope.visible_project) {
				body.addClass("overflowHidden");
				$rootScope.modal_class = "modal-backdrop fade in";
			} else {
				body.removeClass("overflowHidden");
				$rootScope.modal_class = "";
			}
		}else if (mode == "startKeyAutoRotation") {
			$rootScope.projectId = projectId;
			$rootScope.startServerKeyRotation = $rootScope.startServerKeyRotation ? false : true;
		}else if (mode == "stopKeyAutoRotation") {
			$rootScope.projectId = projectId;
			$rootScope.stopServerKeyRotation = $rootScope.stopServerKeyRotation ? false : true;
		}else if (mode == "updateServerKey") {
			$rootScope.projectId = projectId;
			$rootScope.updateServerKey = $rootScope.updateServerKey ? false : true;
		}
    };

    $rootScope.popupClose = function(value) {
    	if(value == "startServerKeyRotation"){
			$rootScope.startServerKeyRotation = $rootScope.startServerKeyRotation ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
			$rootScope.projectId = "";
		} else if(value == "stopServerKeyRotation"){
			$rootScope.stopServerKeyRotation = $rootScope.stopServerKeyRotation ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
			$rootScope.projectId = "";
		} else if(value == "updateServerKey"){
			$rootScope.updateServerKey = $rootScope.updateServerKey ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
			$rootScope.projectId = "";
		} 

    };

    $rootScope.popupOk = function(value) {
    	if(value == "startServerKeyRotation"){

    		$http({
			url: "/startServerKeyRotation",
			method: "POST",
			data: {projectId : $rootScope.projectId},
			headers: {"Content-Type": "application/json"}
			})
			.success(function(data){
				if(data.success==1){
				 $rootScope.startServerKeyRotation = $rootScope.startServerKeyRotation ? false : true;
			     body.removeClass("overflowHidden");
			     $rootScope.modal_class = "";
				 $rootScope.projectId = "";
				}
			});
			
		} else if(value == "stopServerKeyRotation"){
			$http({
			url: "/stopServerKeyRotation",
			method: "POST",
			data: {projectId : $rootScope.projectId},
			headers: {"Content-Type": "application/json"}
			})
			.success(function(data){
				console.log("data = : "+JSON.stringify(data));
				if(data.success==1){
				 $rootScope.stopServerKeyRotation = $rootScope.stopServerKeyRotation ? false : true;
				 body.removeClass("overflowHidden");
				 $rootScope.modal_class = "";
				 $rootScope.projectId = "";
				}
				
			});
		
		} else if(value == "updateServerKey"){
			$http({
			url: "/updateServerKeyForProject",
			method: "POST",
			data: {projectId : $rootScope.projectId},
			headers: {"Content-Type": "application/json"}
			})
			.success(function(data){
				if(data.success==1){
				 $rootScope.updateServerKey = $rootScope.updateServerKey ? false : true;
			     body.removeClass("overflowHidden");
			     $rootScope.modal_class = "";
				 $rootScope.projectId = "";
				}
			});
		}
    };
});