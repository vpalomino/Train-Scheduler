// document.ready
$(function() {
    window.onload = function() {

        fetchDBDataUpdateTable();

        setInterval(updateTable, 0);

        $("#add-train").click(addTrain);
    }

    var config = {
        apiKey: "AIzaSyBhXhUdniGpDWlf2uIn76D0i1HQvdcsaqM",
        authDomain: "train-scheduler-ebd06.firebaseapp.com",
        databaseURL: "https://train-scheduler-ebd06.firebaseio.com",
        projectId: "train-scheduler-ebd06",
        storageBucket: "",
        messagingSenderId: "226730887691"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    var trainArray = [];

    function addTrain() {

        var trainName = $("#train-name").val().trim().toUpperCase();
        var destination = $("#destination").val().trim().toUpperCase();
        var departure = $("#leave-time").val().trim();
        var frequency = parseInt($("#frequency").val().trim());

        var regEx = /[\d][\d]:[\d][\d]/;
        var match = departure.match(regEx);

        if (match === null) {
            alert("Please enter a departure time in HH:mm.");
            return;
        }


        if (frequency <= 0 || isNaN(frequency)) {
            alert("Please enter a valid frequency. Positive integer.");
            return;
        }
        database.ref("trains/" + moment()).set({
            trainName: trainName,
            destination: destination,
            departure: departure,
            frequency: frequency,
        });

        $("input").val("");
    }

    function updateTable() {
        $(".tableRow").remove();
        for (var i = 0; i < trainArray.length; i++) {

            var trainName = trainArray[i].val().trainName;
            var destination = trainArray[i].val().destination;
            var departure = trainArray[i].val().departure;
            var frequency = trainArray[i].val().frequency;
            var nextArrival = null;
            var minutesAway = null;

            var convertedDeparture = moment(departure, "HH:mm");

            var comTime = moment();

            
            var timeDiff = moment().diff(moment(convertedDeparture), "minutes");

            var remainder = timeDiff % frequency;

            minutesAway = frequency - remainder;

            nextArrival = moment().add(minutesAway, "minutes").format("HH:mm");

            var newRow = $("<tr>");
            newRow.addClass("tableRow");
            var row1 = $("<td>");
            var row2 = $("<td>");
            var row3 = $("<td>");
            var row4 = $("<td>");
            var row5 = $("<td>");

            row1.text(trainName);
            row2.text(destination);
            row3.text(frequency);
            row4.text(nextArrival);
            row5.text(minutesAway);

            row4.addClass("updateTime");
            row5.addClass("updateMinutes");

            row1.appendTo(newRow);
            row2.appendTo(newRow);
            row3.appendTo(newRow);
            row4.appendTo(newRow);
            row5.appendTo(newRow);

            newRow.appendTo("#train-table");
        }
    }

    function fetchDBDataUpdateTable() {

        var ref = database.ref("trains");
        ref.orderByKey().on("child_added", function(snapshot) {

            trainArray.push(snapshot);

        });
    }
});