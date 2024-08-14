import { spawnSync } from 'child_process';

function generateCertificate() {
  const result = spawnSync('openssl', [
    'req',
    '-x509',
    '-newkey', 'rsa:2048',
    '-keyout', 'key.pem',
    '-out', 'cert.pem',
    '-days', '365',
    '-nodes',
    '-subj', '/CN=localhost'
  ]);

  if (result.error) {
    console.error('Error generating certificate:', result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error('OpenSSL command failed:', result.stderr.toString());
    process.exit(1);
  }

  console.log('Self-signed certificate generated successfully.');
}

generateCertificate();