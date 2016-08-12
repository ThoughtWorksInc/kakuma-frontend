describe("App view controller", function() {

  it("should proceed to the summary screen on next when all questions are answered", function() {
    // var appController = require("../../javascript/appViewController");
    // var summaryView = require("../../javaascript/summaryView");
    spyOn(appController, "getFirstUnansweredQuestion").andReturn(null);

    expect(appController.showNextScreen(), toBe(summaryView));

  });
})
