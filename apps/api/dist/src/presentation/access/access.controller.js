"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const access_service_1 = require("../../application/access/access.service");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let AccessController = class AccessController {
    constructor(accessService) {
        this.accessService = accessService;
    }
    check(clientId) {
        return this.accessService.checkAccess(clientId);
    }
};
exports.AccessController = AccessController;
__decorate([
    (0, common_1.Get)(':clientId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Validar acesso do cliente (uso pelo PDV)',
        description: 'Retorna active: true/false. Se invoice overdue > 10 dias, active = false.',
    }),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AccessController.prototype, "check", null);
exports.AccessController = AccessController = __decorate([
    (0, swagger_1.ApiTags)('Access'),
    (0, common_1.Controller)('access'),
    __metadata("design:paramtypes", [access_service_1.AccessService])
], AccessController);
//# sourceMappingURL=access.controller.js.map