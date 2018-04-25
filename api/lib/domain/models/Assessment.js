const _ = require('lodash');
const TYPES_OF_ASSESSMENT_NEEDING_USER = ['PLACEMENT', 'CERTIFICATION'];
const { ObjectValidationError } = require('../errors');

const states = {
  COMPLETED: 'completed',
  STARTED: 'started'
};

class Assessment {

  constructor(attributes) {
    Object.assign(this, attributes);
  }

  isCompleted() {
    return this.state === Assessment.states.COMPLETED;
  }

  getLastAssessmentResult() {
    if (this.assessmentResults) {
      return _(this.assessmentResults).sortBy(['createdAt']).last();
    }
    return null;
  }

  getPixScore() {
    if (this.getLastAssessmentResult()) {
      return this.getLastAssessmentResult().pixScore;
    }
    return null;
  }

  getLevel() {
    if (this.getLastAssessmentResult()) {
      return this.getLastAssessmentResult().level;
    }
    return null;
  }

  setCompleted() {
    this.state = Assessment.states.COMPLETED;
  }

  validate() {
    if (TYPES_OF_ASSESSMENT_NEEDING_USER.includes(this.type) && !this.userId) {
      return Promise.reject(new ObjectValidationError(`Assessment ${this.type} needs an User Id`));
    }
    return Promise.resolve();
  }
}

Assessment.states = states;

module.exports = Assessment;
