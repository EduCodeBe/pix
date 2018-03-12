class Assessment {
  constructor(attributes) {
    Object.assign(this, attributes);
  }

  isCompleted() {
    return this.state === 'completed';
  }

  getLastAssessmentResult() {
    if(this.assessmentResults) {
      const sortedAssessmentResult = this.assessmentResults.sort((r1, r2) => r1.createdAt < r2.createdAt);
      return sortedAssessmentResult[0];
    }
    return null;
  }
}

module.exports = Assessment;
