import { environment } from '@environments/environment';

const LOGIN_URL = 'https://login.intranet.bb.com.br/sso';
const OLD_BACKEND_URL = environment.oldBackendUrl;
const FRONTEND_URL = environment.frontendUrl;
const BACKEND_URL = environment.backEndUrl;

export const ORGCHART_URL  = 'https://humanograma.intranet.bb.com.br';
export const AVATAR_URL    = `${ORGCHART_URL}/avatar`;
export const REST_URL      = `${OLD_BACKEND_URL}/scan/api`;
export const SCAN_API_V1   = `${BACKEND_URL}/scan-api/v1`;

export const REMOTE_ROUTES = {
  login:                      `${LOGIN_URL}/XUI/#login/&goto=${encodeURIComponent(FRONTEND_URL)}`,
  logout:                     `${LOGIN_URL}/UI/Logout`,
  adminFeatures:              `${REST_URL}/listarFuncionalidades`,
  adminSaveFeature:           `${REST_URL}/salvarFuncionalidade`,
  adminProfiles:              `${REST_URL}/listarPerfis`,
  adminSaveProfile:           `${REST_URL}/salvarPerfil`,
  adminUsers:                 `${REST_URL}/listarUsuarios`,
  adminSaveUser:              `${REST_URL}/salvarUsuario`,
  adminJobs:                  `${REST_URL}/listarJobsDiario`,
  // old, to replace
  userAttributes:             `${OLD_BACKEND_URL}/scan/getAtributosUsuario`,
  registerUser:               `${REST_URL}/registrarUsuario`,
  // new
  projectVersion:             `${SCAN_API_V1}/aplicacao/versao`,
  highEnd:                    `${SCAN_API_V1}/ambienteDistribuido`,
  highEndBSB:                 `${SCAN_API_V1}/ambienteDistribuido/bsb`,
  highEndGuestsByHosts:       `${SCAN_API_V1}/servidorVirtual/buscarPorServidoresFisicos`,
  highEndHostsByIds:          `${SCAN_API_V1}/servidorFisico/buscarPorIds`,
  mainframe:                  `${SCAN_API_V1}/mainframe`,
  diskStorage:                `${SCAN_API_V1}/storageDiscos`,
  referenceMatrix:            `${SCAN_API_V1}/matrizReferencia/camadas`,
  appPortfolio:               `${SCAN_API_V1}/matrizReferencia/portfolio`,
  tapeLibrary:                `${SCAN_API_V1}/fitoteca`,
  logicalNetworkDetails:      `${SCAN_API_V1}/rede/detalhar/id`,
  logicalInterfaceDetails:    `${SCAN_API_V1}/interfaceAplicativo/detalhar/id`,
  logicalAdabasDetails:       `${SCAN_API_V1}/armazenamento/adabas`,
  logicalDB2Details:          `${SCAN_API_V1}/armazenamento/db2`,
  logicalCICSDetails:         `${SCAN_API_V1}/cics/listarProcessamentoPorSiglas`,
  mainframeImagesByName:      `${SCAN_API_V1}/image/buscarPorNomes`,
  logicalBatchDetails:        `${SCAN_API_V1}/jobBatch/listarExecucoesProcessamentoBatchPorSiglas`,
  interfaceMap:               `${SCAN_API_V1}/marcacao/interface`,
  appsMap:                    `${SCAN_API_V1}/marcacao/siglas`,
  // To be implemented
  logicalBatchDetailsByName:  `${SCAN_API_V1}/jobBatch/listarJobAgendadoBatchPorNome/nome`
};
