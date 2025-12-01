import React, { useState } from 'react';

const elements = [
    { id: 1, x: 1, y: 1, symbol: "H", name: "수소", atomicMass: 1.008, category: "비금속" },
    { id: 2, x: 18, y: 1, symbol: "He", name: "헬륨", atomicMass: 4.0026, category: "비활성 기체" },
    { id: 3, x: 1, y: 2, symbol: "Li", name: "리튬", atomicMass: 6.94, category: "알칼리 금속" },
    { id: 4, x: 2, y: 2, symbol: "Be", name: "베릴륨", atomicMass: 9.0122, category: "알칼리 토금속" },
    { id: 5, x: 13, y: 2, symbol: "B", name: "붕소", atomicMass: 10.81, category: "준금속" },
    { id: 6, x: 14, y: 2, symbol: "C", name: "탄소", atomicMass: 12.011, category: "비금속" },
    { id: 7, x: 15, y: 2, symbol: "N", name: "질소", atomicMass: 14.007, category: "비금속" },
    { id: 8, x: 16, y: 2, symbol: "O", name: "산소", atomicMass: 15.999, category: "비금속" },
    { id: 9, x: 17, y: 2, symbol: "F", name: "플루오린", atomicMass: 18.998, category: "할로겐" },
    { id: 10, x: 18, y: 2, symbol: "Ne", name: "네온", atomicMass: 20.180, category: "비활성 기체" },
    { id: 11, x: 1, y: 3, symbol: "Na", name: "나트륨", atomicMass: 22.990, category: "알칼리 금속" },
    { id: 12, x: 2, y: 3, symbol: "Mg", name: "마그네슘", atomicMass: 24.305, category: "알칼리 토금속" },
    { id: 13, x: 13, y: 3, symbol: "Al", name: "알루미늄", atomicMass: 26.982, category: "전이후 금속" },
    { id: 14, x: 14, y: 3, symbol: "Si", name: "규소", atomicMass: 28.085, category: "준금속" },
    { id: 15, x: 15, y: 3, symbol: "P", name: "인", atomicMass: 30.974, category: "비금속" },
    { id: 16, x: 16, y: 3, symbol: "S", name: "황", atomicMass: 32.06, category: "비금속" },
    { id: 17, x: 17, y: 3, symbol: "Cl", name: "염소", atomicMass: 35.45, category: "할로겐" },
    { id: 18, x: 18, y: 3, symbol: "Ar", name: "아르곤", atomicMass: 39.948, category: "비활성 기체" },
    { id: 19, x: 1, y: 4, symbol: "K", name: "칼륨", atomicMass: 39.098, category: "알칼리 금속" },
    { id: 20, x: 2, y: 4, symbol: "Ca", name: "칼슘", atomicMass: 40.078, category: "알칼리 토금속" },
    { id: 21, x: 3, y: 4, symbol: "Sc", name: "스칸듐", atomicMass: 44.956, category: "전이 금속" },
    { id: 22, x: 4, y: 4, symbol: "Ti", name: "티타늄", atomicMass: 47.867, category: "전이 금속" },
    { id: 23, x: 5, y: 4, symbol: "V", name: "바나듐", atomicMass: 50.942, category: "전이 금속" },
    { id: 24, x: 6, y: 4, symbol: "Cr", name: "크로뮴", atomicMass: 51.996, category: "전이 금속" },
    { id: 25, x: 7, y: 4, symbol: "Mn", name: "망가니즈", atomicMass: 54.938, category: "전이 금속" },
    { id: 26, x: 8, y: 4, symbol: "Fe", name: "철", atomicMass: 55.845, category: "전이 금속" },
    { id: 27, x: 9, y: 4, symbol: "Co", name: "코발트", atomicMass: 58.933, category: "전이 금속" },
    { id: 28, x: 10, y: 4, symbol: "Ni", name: "니켈", atomicMass: 58.693, category: "전이 금속" },
    { id: 29, x: 11, y: 4, symbol: "Cu", name: "구리", atomicMass: 63.546, category: "전이 금속" },
    { id: 30, x: 12, y: 4, symbol: "Zn", name: "아연", atomicMass: 65.38, category: "전이 금속" },
    { id: 31, x: 13, y: 4, symbol: "Ga", name: "갈륨", atomicMass: 69.723, category: "전이후 금속" },
    { id: 32, x: 14, y: 4, symbol: "Ge", name: "저마늄", atomicMass: 72.630, category: "준금속" },
    { id: 33, x: 15, y: 4, symbol: "As", name: "비소", atomicMass: 74.922, category: "준금속" },
    { id: 34, x: 16, y: 4, symbol: "Se", name: "셀레늄", atomicMass: 78.971, category: "비금속" },
    { id: 35, x: 17, y: 4, symbol: "Br", name: "브로민", atomicMass: 79.904, category: "할로겐" },
    { id: 36, x: 18, y: 4, symbol: "Kr", name: "크립톤", atomicMass: 83.798, category: "비활성 기체" },
    { id: 37, x: 1, y: 5, symbol: "Rb", name: "루비듐", atomicMass: 85.468, category: "알칼리 금속" },
    { id: 38, x: 2, y: 5, symbol: "Sr", name: "스트론튬", atomicMass: 87.62, category: "알칼리 토금속" },
    { id: 39, x: 3, y: 5, symbol: "Y", name: "이트륨", atomicMass: 88.906, category: "전이 금속" },
    { id: 40, x: 4, y: 5, symbol: "Zr", name: "지르코늄", atomicMass: 91.224, category: "전이 금속" },
    { id: 41, x: 5, y: 5, symbol: "Nb", name: "나이오븀", atomicMass: 92.906, category: "전이 금속" },
    { id: 42, x: 6, y: 5, symbol: "Mo", name: "몰리브데넘", atomicMass: 95.95, category: "전이 금속" },
    { id: 43, x: 7, y: 5, symbol: "Tc", name: "테크네튬", atomicMass: 98, category: "전이 금속" },
    { id: 44, x: 8, y: 5, symbol: "Ru", name: "루테늄", atomicMass: 101.07, category: "전이 금속" },
    { id: 45, x: 9, y: 5, symbol: "Rh", name: "로듐", atomicMass: 102.91, category: "전이 금속" },
    { id: 46, x: 10, y: 5, symbol: "Pd", name: "팔라듐", atomicMass: 106.42, category: "전이 금속" },
    { id: 47, x: 11, y: 5, symbol: "Ag", name: "은", atomicMass: 107.87, category: "전이 금속" },
    { id: 48, x: 12, y: 5, symbol: "Cd", name: "카드뮴", atomicMass: 112.41, category: "전이 금속" },
    { id: 49, x: 13, y: 5, symbol: "In", name: "인듐", atomicMass: 114.82, category: "전이후 금속" },
    { id: 50, x: 14, y: 5, symbol: "Sn", name: "주석", atomicMass: 118.71, category: "전이후 금속" },
    { id: 51, x: 15, y: 5, symbol: "Sb", name: "안티모니", atomicMass: 121.76, category: "준금속" },
    { id: 52, x: 16, y: 5, symbol: "Te", name: "텔루륨", atomicMass: 127.60, category: "준금속" },
    { id: 53, x: 17, y: 5, symbol: "I", name: "아이오딘", atomicMass: 126.90, category: "할로겐" },
    { id: 54, x: 18, y: 5, symbol: "Xe", name: "제논", atomicMass: 131.29, category: "비활성 기체" },
    { id: 55, x: 1, y: 6, symbol: "Cs", name: "세슘", atomicMass: 132.91, category: "알칼리 금속" },
    { id: 56, x: 2, y: 6, symbol: "Ba", name: "바륨", atomicMass: 137.33, category: "알칼리 토금속" },
    { id: 57, x: 3, y: 9, symbol: "La", name: "란타넘", atomicMass: 138.91, category: "란타넘족 원소" },
    { id: 58, x: 4, y: 9, symbol: "Ce", name: "세륨", atomicMass: 140.12, category: "란타넘족 원소" },
    { id: 59, x: 5, y: 9, symbol: "Pr", name: "프라세오디뮴", atomicMass: 140.91, category: "란타넘족 원소" },
    { id: 60, x: 6, y: 9, symbol: "Nd", name: "네오디뮴", atomicMass: 144.24, category: "란타넘족 원소" },
    { id: 61, x: 7, y: 9, symbol: "Pm", name: "프로메튬", atomicMass: 145, category: "란타넘족 원소" },
    { id: 62, x: 8, y: 9, symbol: "Sm", name: "사마륨", atomicMass: 150.36, category: "란타넘족 원소" },
    { id: 63, x: 9, y: 9, symbol: "Eu", name: "유로퓸", atomicMass: 151.96, category: "란타넘족 원소" },
    { id: 64, x: 10, y: 9, symbol: "Gd", name: "가돌리늄", atomicMass: 157.25, category: "란타넘족 원소" },
    { id: 65, x: 11, y: 9, symbol: "Tb", name: "터븀", atomicMass: 158.93, category: "란타넘족 원소" },
    { id: 66, x: 12, y: 9, symbol: "Dy", name: "디스프로슘", atomicMass: 162.50, category: "란타넘족 원소" },
    { id: 67, x: 13, y: 9, symbol: "Ho", name: "홀뮴", atomicMass: 164.93, category: "란타넘족 원소" },
    { id: 68, x: 14, y: 9, symbol: "Er", name: "어븀", atomicMass: 167.26, category: "란타넘족 원소" },
    { id: 69, x: 15, y: 9, symbol: "Tm", name: "툴륨", atomicMass: 168.93, category: "란타넘족 원소" },
    { id: 70, x: 16, y: 9, symbol: "Yb", name: "이터븀", atomicMass: 173.05, category: "란타넘족 원소" },
    { id: 71, x: 17, y: 9, symbol: "Lu", name: "루테튬", atomicMass: 174.97, category: "란타넘족 원소" },
    { id: 72, x: 4, y: 6, symbol: "Hf", name: "하프늄", atomicMass: 178.49, category: "전이 금속" },
    { id: 73, x: 5, y: 6, symbol: "Ta", name: "탄탈럼", atomicMass: 180.95, category: "전이 금속" },
    { id: 74, x: 6, y: 6, symbol: "W", name: "텅스텐", atomicMass: 183.84, category: "전이 금속" },
    { id: 75, x: 7, y: 6, symbol: "Re", name: "레늄", atomicMass: 186.21, category: "전이 금속" },
    { id: 76, x: 8, y: 6, symbol: "Os", name: "오스뮴", atomicMass: 190.23, category: "전이 금속" },
    { id: 77, x: 9, y: 6, symbol: "Ir", name: "이리듐", atomicMass: 192.22, category: "전이 금속" },
    { id: 78, x: 10, y: 6, symbol: "Pt", name: "백금", atomicMass: 195.08, category: "전이 금속" },
    { id: 79, x: 11, y: 6, symbol: "Au", name: "금", atomicMass: 196.97, category: "전이 금속" },
    { id: 80, x: 12, y: 6, symbol: "Hg", name: "수은", atomicMass: 200.59, category: "전이 금속" },
    { id: 81, x: 13, y: 6, symbol: "Tl", name: "탈륨", atomicMass: 204.38, category: "전이후 금속" },
    { id: 82, x: 14, y: 6, symbol: "Pb", name: "납", atomicMass: 207.2, category: "전이후 금속" },
    { id: 83, x: 15, y: 6, symbol: "Bi", name: "비스무트", atomicMass: 208.98, category: "전이후 금속" },
    { id: 84, x: 16, y: 6, symbol: "Po", name: "폴로늄", atomicMass: 209, category: "준금속" },
    { id: 85, x: 17, y: 6, symbol: "At", name: "아스타틴", atomicMass: 210, category: "할로겐" },
    { id: 86, x: 18, y: 6, symbol: "Rn", name: "라돈", atomicMass: 222, category: "비활성 기체" },
    { id: 87, x: 1, y: 7, symbol: "Fr", name: "프랑슘", atomicMass: 223, category: "알칼리 금속" },
    { id: 88, x: 2, y: 7, symbol: "Ra", name: "라듐", atomicMass: 226, category: "알칼리 토금속" },
    { id: 89, x: 3, y: 10, symbol: "Ac", name: "악티늄", atomicMass: 227, category: "악티늄족 원소" },
    { id: 90, x: 4, y: 10, symbol: "Th", name: "토륨", atomicMass: 232.04, category: "악티늄족 원소" },
    { id: 91, x: 5, y: 10, symbol: "Pa", name: "프로탁티늄", atomicMass: 231.04, category: "악티늄족 원소" },
    { id: 92, x: 6, y: 10, symbol: "U", name: "우라늄", atomicMass: 238.03, category: "악티늄족 원소" },
    { id: 93, x: 7, y: 10, symbol: "Np", name: "넵투늄", atomicMass: 237, category: "악티늄족 원소" },
    { id: 94, x: 8, y: 10, symbol: "Pu", name: "플루토늄", atomicMass: 244, category: "악티늄족 원소" },
    { id: 95, x: 9, y: 10, symbol: "Am", name: "아메리슘", atomicMass: 243, category: "악티늄족 원소" },
    { id: 96, x: 10, y: 10, symbol: "Cm", name: "퀴륨", atomicMass: 247, category: "악티늄족 원소" },
    { id: 97, x: 11, y: 10, symbol: "Bk", name: "버클륨", atomicMass: 247, category: "악티늄족 원소" },
    { id: 98, x: 12, y: 10, symbol: "Cf", name: "칼리포르늄", atomicMass: 251, category: "악티늄족 원소" },
    { id: 99, x: 13, y: 10, symbol: "Es", name: "아인슈타이늄", atomicMass: 252, category: "악티늄족 원소" },
    { id: 100, x: 14, y: 10, symbol: "Fm", name: "페르뮴", atomicMass: 257, category: "악티늄족 원소" },
    { id: 101, x: 15, y: 10, symbol: "Md", name: "멘델레븀", atomicMass: 258, category: "악티늄족 원소" },
    { id: 102, x: 16, y: 10, symbol: "No", name: "노벨륨", atomicMass: 259, category: "악티늄족 원소" },
    { id: 103, x: 17, y: 10, symbol: "Lr", name: "로렌슘", atomicMass: 266, category: "악티늄족 원소" },
    { id: 104, x: 4, y: 7, symbol: "Rf", name: "러더포듐", atomicMass: 267, category: "전이 금속" },
    { id: 105, x: 5, y: 7, symbol: "Db", name: "더브늄", atomicMass: 268, category: "전이 금속" },
    { id: 106, x: 6, y: 7, symbol: "Sg", name: "시보르귬", atomicMass: 269, category: "전이 금속" },
    { id: 107, x: 7, y: 7, symbol: "Bh", name: "보륨", atomicMass: 270, category: "전이 금속" },
    { id: 108, x: 8, y: 7, symbol: "Hs", name: "하슘", atomicMass: 269, category: "전이 금속" },
    { id: 109, x: 9, y: 7, symbol: "Mt", name: "마이트너륨", atomicMass: 278, category: "전이 금속" },
    { id: 110, x: 10, y: 7, symbol: "Ds", name: "다름슈타튬", atomicMass: 281, category: "전이 금속" },
    { id: 111, x: 11, y: 7, symbol: "Rg", name: "뢴트게늄", atomicMass: 282, category: "전이 금속" },
    { id: 112, x: 12, y: 7, symbol: "Cn", name: "코페르니슘", atomicMass: 285, category: "전이 금속" },
    { id: 113, x: 13, y: 7, symbol: "Nh", name: "니호늄", atomicMass: 286, category: "전이후 금속" },
    { id: 114, x: 14, y: 7, symbol: "Fl", name: "플레로븀", atomicMass: 289, category: "전이후 금속" },
    { id: 115, x: 15, y: 7, symbol: "Mc", name: "모스코븀", atomicMass: 290, category: "전이후 금속" },
    { id: 116, x: 16, y: 7, symbol: "Lv", name: "리버모륨", atomicMass: 293, category: "전이후 금속" },
    { id: 117, x: 17, y: 7, symbol: "Ts", name: "테네신", atomicMass: 294, category: "할로겐" },
    { id: 118, x: 18, y: 7, symbol: "Og", name: "오가네손", atomicMass: 294, category: "비활성 기체" },
];

const getCategoryClass = (category) => {
    switch (category) {
        case "알칼리 금속": return "bg-alkali";
        case "알칼리 토금속": return "bg-alkali-earth";
        case "란타넘족 원소": return "bg-lanthanide";
        case "악티늄족 원소": return "bg-actinide";
        case "전이 금속": return "bg-transition";
        case "전이후 금속": return "bg-post-transition";
        case "준금속": return "bg-metalloid";
        case "비금속": return "bg-nonmetal";
        case "할로겐": return "bg-halogen";
        case "비활성 기체": return "bg-noble-gas";
        default: return "bg-unknown";
    }
};

const ElementBox = ({ element, onClick, isSelected }) => {
    return (
        <div
            className={`element-box ${getCategoryClass(element.category)} ${isSelected ? "selected-ring" : ""}`}
            style={{ gridColumnStart: element.x, gridRowStart: element.y }}
            onClick={() => onClick(element)}
        >
            <div className="element-box-id">{element.id}</div>
            <div className="element-box-symbol">{element.symbol}</div>
            <div className="element-box-name">{element.name}</div>
        </div>
    );
};

const AtomVisualization = ({ atomicNumber }) => {
    const getElectronShells = (electrons) => {
        const shells = [];
        const maxElectronsPerShell = [2, 8, 18, 32, 32, 18, 8];
        let remaining = electrons;

        for (let i = 0; i < maxElectronsPerShell.length && remaining > 0; i++) {
            const electronsInShell = Math.min(remaining, maxElectronsPerShell[i]);
            shells.push(electronsInShell);
            remaining -= electronsInShell;
        }
        if (shells.length > 1 && shells[shells.length - 1] > 8) {
            const excess = shells[shells.length - 1] - 8;
            shells[shells.length - 1] = 8;
            shells.push(excess);
        }

        return shells;
    };

    const shells = getElectronShells(atomicNumber);
    const centerX = 200;
    const centerY = 200;
    const baseRadius = 15;
    const shellGap = 26;

    return (
        <svg width="100%" height="400" viewBox="0 0 400 400" style={{ margin: '0 auto', display: 'block' }}>
            <circle
                cx={centerX}
                cy={centerY}
                r={baseRadius}
                fill="url(#nucleusGradient)"
                stroke="#ef4444"
                strokeWidth="2"
            />
            <text
                x={centerX}
                y={centerY + 6}
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
            >
                {atomicNumber}
            </text>

            <defs>
                <radialGradient id="nucleusGradient">
                    <stop offset="0%" stopColor="#fca5a5" />
                    <stop offset="100%" stopColor="#ef4444" />
                </radialGradient>
                <radialGradient id="electronGradient">
                    <stop offset="0%" stopColor="#93c5fd" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </radialGradient>
            </defs>

            {shells.map((electronCount, shellIndex) => {
                const radius = baseRadius + (shellIndex + 1) * shellGap;
                const angleStep = (2 * Math.PI) / electronCount;

                return (
                    <g key={shellIndex}>
                        <circle
                            cx={centerX}
                            cy={centerY}
                            r={radius}
                            fill="none"
                            stroke="#cbd5e1"
                            strokeWidth="1.5"
                            strokeDasharray="4 4"
                            opacity="0.6"
                        />

                        {Array.from({ length: electronCount }).map((_, electronIndex) => {
                            const angle = angleStep * electronIndex - Math.PI / 2;
                            const x = centerX + radius * Math.cos(angle);
                            const y = centerY + radius * Math.sin(angle);

                            return (
                                <g key={electronIndex}>
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r="5"
                                        fill="url(#electronGradient)"
                                        stroke="#1e40af"
                                        strokeWidth="1"
                                    >
                                        <animateTransform
                                            attributeName="transform"
                                            type="rotate"
                                            from={`0 ${centerX} ${centerY}`}
                                            to={`360 ${centerX} ${centerY}`}
                                            dur={`${3 + shellIndex}s`}
                                            repeatCount="indefinite"
                                        />
                                    </circle>
                                </g>
                            );
                        })}
                    </g>
                );
            })}
        </svg>
    );
};

const Modal = ({ element, onClose }) => {
    if (!element) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                    <h2 className="modal-symbol">{element.symbol}</h2>
                    <p className="modal-name">{element.name}</p>
                    <p className="modal-atomic-number">원자 번호: {element.id}</p>
                </div>

                <div className="modal-content">
                    <div style={{
                        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '20px',
                        border: '2px solid #bae6fd'
                    }}>
                        <h3 style={{
                            textAlign: 'center',
                            color: '#0369a1',
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '12px'
                        }}>
                            원자 구조
                        </h3>
                        <AtomVisualization atomicNumber={element.id} />
                    </div>

                    <div className="modal-info-row">
                        <span className="modal-info-label">원자 질량</span>
                        <span className="modal-info-value">{element.atomicMass}</span>
                    </div>
                    <div className="modal-info-row">
                        <span className="modal-info-label">분류</span>
                        <span className="modal-info-value">{element.category}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Login = ({ onBack, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        if (!email || !password) {
            alert('이메일과 비밀번호를 입력해주세요.');
            return;
        }
        const userData = {
            name: email.split('@')[0],
            email: email,
            picture: 'https://via.placeholder.com/32'
        };
        onLogin(userData, 'temp-token-' + Date.now());
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>로그인</h2>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>이메일</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                        placeholder="example@email.com"
                    />
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                        placeholder="••••••••"
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginBottom: '8px' }}
                >
                    로그인
                </button>
                <button
                    onClick={onBack}
                    style={{ width: '100%', backgroundColor: '#d1d5db', color: '#374151', padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                    메인으로 돌아가기
                </button>
            </div>
        </div>
    );
};
const Main = ({ user, onNavigate, onLogout }) => {
    const [selectedElement, setSelectedElement] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredElements = elements.filter(element =>
        element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.id.toString().includes(searchQuery)
    );

    return (
        <div className="gle" style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            <header>
                <div className="logo">JuJu</div>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="search-btn">
                        <i className="fas fa-search"></i>
                    </button>
                </div>
                <div className="login-join">
                    {user ? (
                        <>
                            <span style={{ marginRight: '10px', color: '#3b82f6', fontWeight: '600' }}>
                                {user.name}님
                            </span>
                            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>로그아웃</a>
                        </>
                    ) : (
                        <>
                            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>SIGN IN</a> |
                            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('logup'); }}>SIGN UP</a>
                        </>
                    )}
                </div>
            </header>

            <div className="nav-tabs">
                <div className="active" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>메인 페이지</div>
                <div className="active" onClick={() => onNavigate('ai')}>AI와 토론</div>
                <div className="active" onClick={() => onNavigate('mypage')}>개인 페이지</div>
            </div>

            <main>
                <div className="periodic-grid">
                    {filteredElements.map((element) => (
                        <ElementBox
                            key={element.id}
                            element={element}
                            onClick={setSelectedElement}
                            isSelected={selectedElement && selectedElement.id === element.id}
                        />
                    ))}
                </div>
            </main>

            <Modal element={selectedElement} onClose={() => setSelectedElement(null)} />
        </div>
    );
};

export default Main;