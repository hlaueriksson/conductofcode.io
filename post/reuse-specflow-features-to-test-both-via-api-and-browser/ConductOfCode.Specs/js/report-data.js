var reportData = {
  "generator": "SpecResults.WebApp.WebAppReporter",
  "features": [
    {
      "description": "\tIn order to support last-in-first-out (LIFO) operations\n\tAs an developer\n\tI want to use a stack",
      "description_html": "<pre><code>In order to support last-in-first-out (LIFO) operations<br />As an developer<br />I want to use a stack<br /></code></pre>",
      "scenarios": [
        {
          "given": {
            "result": "OK",
            "steps": [
              {
                "steps": [],
                "title": "an empty stack",
                "start_time": "2017-01-22T19:39:15.799618+01:00",
                "end_time": "2017-01-22T19:39:15.8026128+01:00",
                "result": "OK"
              }
            ],
            "start_time": "2017-01-22T19:39:15.7499926+01:00",
            "end_time": "2017-01-22T19:39:15.8051196+01:00"
          },
          "when": {
            "result": "OK",
            "steps": [],
            "start_time": "0001-01-01T00:00:00",
            "end_time": "0001-01-01T00:00:00"
          },
          "then": {
            "result": "OK",
            "steps": [
              {
                "steps": [],
                "title": "it has no elements",
                "start_time": "2017-01-22T19:39:15.8186815+01:00",
                "end_time": "2017-01-22T19:39:15.8191827+01:00",
                "result": "OK"
              },
              {
                "steps": [],
                "title": "it throws an exception when calling pop",
                "start_time": "2017-01-22T19:39:15.8342248+01:00",
                "end_time": "2017-01-22T19:39:15.8362016+01:00",
                "result": "OK"
              },
              {
                "steps": [],
                "title": "it throws an exception when calling peek",
                "start_time": "2017-01-22T19:39:15.8367031+01:00",
                "end_time": "2017-01-22T19:39:15.8367031+01:00",
                "result": "OK"
              }
            ],
            "start_time": "2017-01-22T19:39:15.8056202+01:00",
            "end_time": "2017-01-22T19:39:15.8382072+01:00"
          },
          "result": "OK",
          "tags": [],
          "title": "Empty stack",
          "start_time": "2017-01-22T19:39:15.7469648+01:00",
          "end_time": "2017-01-22T19:39:15.8432202+01:00"
        },
        {
          "given": {
            "result": "OK",
            "steps": [
              {
                "steps": [],
                "title": "a non empty stack",
                "start_time": "2017-01-22T19:39:15.8487347+01:00",
                "end_time": "2017-01-22T19:39:15.8492362+01:00",
                "result": "OK"
              }
            ],
            "start_time": "2017-01-22T19:39:15.8482335+01:00",
            "end_time": "2017-01-22T19:39:15.8492362+01:00"
          },
          "when": {
            "result": "OK",
            "steps": [
              {
                "steps": [],
                "title": "calling peek",
                "start_time": "2017-01-22T19:39:15.8497377+01:00",
                "end_time": "2017-01-22T19:39:15.8497377+01:00",
                "result": "OK"
              },
              {
                "steps": [],
                "title": "calling pop",
                "start_time": "2017-01-22T19:39:15.8532469+01:00",
                "end_time": "2017-01-22T19:39:15.8532469+01:00",
                "result": "OK"
              }
            ],
            "start_time": "2017-01-22T19:39:15.8532469+01:00",
            "end_time": "2017-01-22T19:39:15.8532469+01:00"
          },
          "then": {
            "result": "OK",
            "steps": [
              {
                "steps": [],
                "title": "it returns the top element",
                "start_time": "2017-01-22T19:39:15.8502389+01:00",
                "end_time": "2017-01-22T19:39:15.851743+01:00",
                "result": "OK"
              },
              {
                "steps": [],
                "title": "it does not remove the top element",
                "start_time": "2017-01-22T19:39:15.8522442+01:00",
                "end_time": "2017-01-22T19:39:15.8532469+01:00",
                "result": "OK"
              },
              {
                "steps": [],
                "title": "it returns the top element",
                "start_time": "2017-01-22T19:39:15.853748+01:00",
                "end_time": "2017-01-22T19:39:15.853748+01:00",
                "result": "OK"
              },
              {
                "steps": [],
                "title": "it removes the top element",
                "start_time": "2017-01-22T19:39:15.8542498+01:00",
                "end_time": "2017-01-22T19:39:15.854751+01:00",
                "result": "OK"
              }
            ],
            "start_time": "2017-01-22T19:39:15.8532469+01:00",
            "end_time": "2017-01-22T19:39:15.854751+01:00"
          },
          "result": "OK",
          "tags": [],
          "title": "Non empty stack",
          "start_time": "2017-01-22T19:39:15.8482335+01:00",
          "end_time": "2017-01-22T19:39:15.854751+01:00"
        }
      ],
      "result": "OK",
      "tags": [],
      "title": "Stack",
      "start_time": "2017-01-22T19:39:15.7003411+01:00",
      "end_time": "2017-01-22T19:39:15.8562548+01:00"
    }
  ],
  "result": "OK",
  "start_time": "2017-01-22T19:39:15.7003411+01:00",
  "end_time": "2017-01-22T19:39:15.8803191+01:00"
};