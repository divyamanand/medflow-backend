"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LlmService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmService = void 0;
const common_1 = require("@nestjs/common");
let LlmService = LlmService_1 = class LlmService {
    constructor() {
        this.logger = new common_1.Logger(LlmService_1.name);
    }
    async inferSpecialties(issues, specialties) {
        var _a, _b, _c, _d, _e, _f;
        if (!issues || !issues.length)
            return [];
        const apiKey = process.env.LLM_API_KEY;
        if (!apiKey) {
            this.logger.warn('LLM_API_KEY not set — falling back to simple heuristic');
            return this.heuristicMatch(issues, specialties);
        }
        const names = specialties.map((s) => s.name);
        const prompt = `You are a medical triage assistant. Given the following patient issues:\n\n${issues
            .map((i) => `- ${i}`)
            .join('\n')}\n\nAnd the available specialties: ${names.join(', ')}\n\nReturn a JSON array (only) of specialty names, taken from the available specialties, that are most relevant to address the issues. Order by relevance, highest first.`;
        try {
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: (_a = process.env.LLM_MODEL) !== null && _a !== void 0 ? _a : 'gpt-4o-mini',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 300,
                    temperature: 0.0,
                }),
            });
            const j = await res.json();
            const txt = ((_d = (_c = (_b = j === null || j === void 0 ? void 0 : j.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) || ((_f = (_e = j === null || j === void 0 ? void 0 : j.choices) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.text) || '';
            const m = txt.match(/\[([\s\S]*)\]/m);
            if (m) {
                const arrText = '[' + m[1] + ']';
                try {
                    const parsed = JSON.parse(arrText);
                    if (Array.isArray(parsed)) {
                        const lowerSet = new Set(names.map((n) => n.toLowerCase()));
                        return parsed
                            .map((p) => (typeof p === 'string' ? p.trim() : ''))
                            .filter((s) => !!s && lowerSet.has(s.toLowerCase()))
                            .map((s) => {
                            const found = specialties.find((sp) => sp.name.toLowerCase() === s.toLowerCase());
                            return found ? found.name : s;
                        });
                    }
                }
                catch (e) {
                    this.logger.warn('Failed to parse LLM response JSON, falling back to heuristic', e);
                }
            }
            return this.heuristicMatch(issues, specialties);
        }
        catch (err) {
            this.logger.warn('LLM call failed — using heuristic match', err);
            return this.heuristicMatch(issues, specialties);
        }
    }
    heuristicMatch(issues, specialties) {
        const out = [];
        const text = issues.join(' ').toLowerCase();
        for (const s of specialties) {
            const name = s.name.toLowerCase();
            if (text.includes(name) || name.split(/\s+/).some((t) => t && text.includes(t))) {
                out.push(s.name);
            }
        }
        if (!out.length)
            return specialties.slice(0, 3).map((s) => s.name);
        return Array.from(new Set(out));
    }
};
exports.LlmService = LlmService;
exports.LlmService = LlmService = LlmService_1 = __decorate([
    (0, common_1.Injectable)()
], LlmService);
