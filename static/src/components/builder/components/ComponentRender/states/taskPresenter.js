export const intervalSeconds = 2;
export const states = [
    {
      taskId: 1,
      message: { text: '' },
      active: true,
      status: {
        quizInProgress: true,
        projectCompleted: false,
        quizPassed: false,
        taskInProgress: false
      },
      alerts: {
        quizStarted: true,
        projectCompleted: false
      },
      progress: {
        total: 5,
        done: 0,
        remaining_for_user: 100,
        remaining: 100,
        quiz: {
          result: {
            right: 0,
            wrong: 0
          },
          status: 'in_progress',
          config: {
            enabled: true,
            questions: 10,
            pass: 5,
            short_circuit: true
          }
        }
      }
    },
    {
      alerts: {
        quizStarted: false
      }
    },
    {
      taskId: 2,
      active: true,
      message: {
        text: 'You got it right',
        type: 'alert-success'
      },
      progress: {
        quiz: {
          result: {
            right: 1
          }
        }
      }
    },
    {
      taskId: 3,
      active: true,
      message: {
        text: 'You got it wrong',
        type: 'alert-danger'
      },
      progress: {
        quiz: {
          result: {
            wrong: 1
          }
        }
      }
    },
    {
      taskId: 4,
      active: true,
      message: {
        text: 'You got it right',
        type: 'alert-success'
      },
      progress: {
        quiz: {
          result: {
            right: 2
          }
        }
      }
    },
    {
      taskId: 5,
      active: true,
      message: {
        text: 'You got it right',
        type: 'alert-success'
      },
      progress: {
        quiz: {
          result: {
            right: 3
          }
        }
      }
    },
    {
      taskId: 6,
      active: true,
      message: {
        text: 'You got it right',
        type: 'alert-success'
      },
      progress: {
        quiz: {
          result: {
            right: 4
          }
        }
      }
    },
    {
      taskId: 7,
      active: true,
      message: {
        text: 'You got it right',
        type: 'alert-success'
      },
      status: {
        quizPassed: true
      },
      alerts: {
        quizPassed: true
      },
      progress: {
        quiz: {
          result: {
            right: 5
          },
          status: 'passed'
        }
      }
    },
    {
      taskId: 8,
      active: true,
      message: {
        text: '',
        type: 'alert-success'
      },
      status: {
        quizInProgress: false,
        taskInProgress: true
      },
      alerts: {
        quizPassed: false
      }
    },
    {
      taskId: 9,
      active: true,
      progress: {
        done: 1
      }
    },
    {
      taskId: 10,
      active: true,
      progress: {
        done: 2
      }
    },
    {
      taskId: 11,
      active: true,
      progress: {
        done: 3
      }
    },
    {
      taskId: 12,
      active: true,
      progress: {
        done: 4
      }
    },
    {
      taskId: 13,
      active: true,
      status: {
        projectCompleted: true
      },
      alerts: {
        projectCompleted: true
      },
      progress: {
        done: 5
      }
    }
  ];
  