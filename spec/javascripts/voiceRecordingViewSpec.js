describe("voice recording view", function () {
    var stopButton, micButton;
    beforeEach(function () {
        document.body.innerHTML += '<div><img id="bin-btn">' +
            '<div class="recording-container"><img id="mic"><svg id="stop-btn"><img id="play-btn"</svg></div>' +
            '<button class="next"></button></div>';

        stopButton = document.getElementById("stop-btn");
        micButton = document.getElementById("mic");

    });

    it("should display stop button and hide mic button", function () {
        stopButton.classList.add("hidden");
        micButton.classList.remove("hidden");
        displayStopButton();
        expect(stopButton.classList).not.toContain("hidden");
        expect(micButton.classList).toContain("hidden");
    });
});