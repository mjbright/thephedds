/**

angular.module('containerStats', [])
.controller('containerStatsController', ['$scope', '$routeParams', '$location', '$anchorScroll', 'BarChart', 'ContainerStats', 'ViewSpinner',
function($scope, $routeParams, $location, $anchorScroll, BarChart, ContainerStats, ViewSpinner) {

    var getstats = function(data) {
        LineChart.build('#containers-stats-chart', data, function(c) { return new Date(c.Created * 1000).toLocaleDateString(); });
        var s = $scope;
    };

    ContainerStats.get($routeParams.id,
	function(data, status, headers, config) {
		getstats(data);
                console.log(data);
                var c = new Chart($('#containers-stats-chart').get(0).getContext("2d"));
                var statsdata = [
                {
                        value: running,
                        color: '#5bb75b',
                        title: 'Running'
                }, // running
                {
                        value: stopped,
                        color: '#C7604C',
                        title: 'Stopped'
                }, // stopped
                {
                        value: ghost,
                        color: '#E2EAE9',
                        title: 'Ghost'
                } // ghost
                ];

                c.Doughnut(statsdata, opts);
                var lgd = $('#chart-stats-legend').get(0);
                legend(lgd, statsdata);
            ViewSpinner.stop();
        });

}]);
*/

angular.module('containerStats', [])
    .controller('ContainerStatsController', ['$scope', '$routeParams', 'ContainerStats', 'LineChart', 'ViewSpinner',  function ($scope, $routeParams, ContainerStats, LineChart, ViewSpinner) {
        /**
         * Get container stats
         */
	var opts = {animation:true};
        $scope.getstats = function () {
            ViewSpinner.spin();
            ContainerStats.get($routeParams.id,{ 
		stream: 0
            }, function (d) {
		var total_usage = [];
      		total_usage.push(d.cpu_stats.cpu_usage.total_usage);
      		total_usage.push(d.memory_stats.max_usage);
      		var usage = [];
      		usage.push(d.cpu_stats.cpu_usage.usage_in_usermode);
      		usage.push(d.memory_stats.usage);	

		var data = {
        	labels: ["CPU", "Memory"],
        	datasets: [
        	{
            		label: "Total Usage",
            		fillColor: "rgba(0,0,255,1)",
            		strokeColor: "rgba(220,220,220,0.8)",
            		highlightFill: "rgba(220,220,220,0.75)",
            		highlightStroke: "rgba(220,220,220,1)",
            		data: total_usage
        	},
        	{
            		label: "Usage",
            		fillColor: "rgba(0,255,0,1)",
            		strokeColor: "rgba(151,187,205,0.8)",
            		highlightFill: "rgba(151,187,205,0.75)",
            		highlightStroke: "rgba(151,187,205,1)",
            		data: usage
        	}
        	]
		};
	var ctx = $('#containers-stats-chart').get(0).getContext("2d");
	var myBarChart = new Chart(ctx).Bar(data, opts);
	/**var c = new Chart($('#containers-stats-chart').get(0).getContext("2d"));
      	*c.Doughnut(data, opts);
      	*var lgd = $('#chart-stats-legend').get(0);
      	*legend(lgd, data);
        */
    });
   };
    $scope.getstats();
}]);
