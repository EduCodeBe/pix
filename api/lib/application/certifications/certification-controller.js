const usecases = require('../../domain/usecases');
const certificationSerializer = require('../../infrastructure/serializers/jsonapi/certification-serializer');
const certificationRepository = require('../../infrastructure/repositories/certification-repository');

module.exports = {
  findUserCertifications(request, reply) {
    const userId = request.auth.credentials.userId;
    return usecases.findCompletedUserCertifications({userId, certificationRepository})
      .then(certifications => {
        reply(certificationSerializer.serializeCertification(certifications)).code(200);
      });
  }
}
