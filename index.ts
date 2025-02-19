//ColorTrace an app to trace color
import { join } from 'path';
import sharp from 'sharp';

// Define wire color mappings from your diagram
const wireColors = {
    'ro/ge': { r: 255, g: 165, b: 0 },  // red/yellow
    'bl/ro': { r: 0, g: 0, b: 255 },    // blue/red
    'gr/li': { r: 128, g: 128, b: 128 }, // grey/violet
    'gn/ws': { r: 0, g: 255, b: 0 },    // green/white
    'br': { r: 165, g: 42, b: 42 },     // brown
};

async function processWiringDiagram(inputPath: string) {
    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // Calculate positions based on image dimensions
        const width = metadata.width || 800;
        const height = metadata.height || 600;
        
        // Calculate key positions relative to image size
        const mainBarY = Math.round(height * 0.32); // Main horizontal bar position
        const leftMargin = Math.round(width * 0.08);  // Left margin for vertical wires

        const svg = `
            <svg width="${width}" height="${height}">
                <style>
                    .wire { stroke-width: 1.5; fill: none; }
                </style>
                <!-- Main horizontal grey bar (T16) -->
                <path class="wire" stroke="rgb(128,128,128)" d="M ${leftMargin},${mainBarY} L ${width * 0.85},${mainBarY}" />
                
                <!-- First set of vertical wires -->
                <path class="wire" stroke="rgb(255,165,0)" d="M ${leftMargin},${height * 0.15} L ${leftMargin},${mainBarY}" /> <!-- ro/ge -->
                <path class="wire" stroke="rgb(165,42,42)" d="M ${leftMargin},${mainBarY} L ${leftMargin},${height * 0.7}" /> <!-- br -->
                
                <!-- Additional vertical wires with proportional spacing -->
                <path class="wire" stroke="rgb(0,255,0)" d="M ${leftMargin + 30},${height * 0.15} L ${leftMargin + 30},${mainBarY}" />
                <path class="wire" stroke="rgb(255,0,0)" d="M ${leftMargin + 60},${height * 0.15} L ${leftMargin + 60},${mainBarY}" />
                <path class="wire" stroke="rgb(0,0,255)" d="M ${leftMargin + 90},${height * 0.15} L ${leftMargin + 90},${mainBarY}" />
                
                <!-- Lower vertical connections -->
                <path class="wire" stroke="rgb(0,0,255)" d="M ${leftMargin + 50},${mainBarY} L ${leftMargin + 50},${height * 0.7}" />
                <path class="wire" stroke="rgb(128,128,128)" d="M ${leftMargin + 200},${mainBarY} L ${leftMargin + 200},${height * 0.7}" />
                
                <!-- Right side connections -->
                <path class="wire" stroke="rgb(255,0,0)" d="M ${width * 0.6},${mainBarY} L ${width * 0.6},${height * 0.7}" />
                <path class="wire" stroke="rgb(128,128,128)" d="M ${width * 0.7},${mainBarY} L ${width * 0.7},${height * 0.7}" />
            </svg>`;

        const outputPath = 'colored-diagram.png';
        await image
            .composite([{
                input: Buffer.from(svg),
                blend: 'over'
            }])
            .toFile(outputPath);

        console.log(`Colored diagram saved to: ${outputPath}`);
        console.log('\nWire colors used:');
        Object.entries(wireColors).forEach(([code, color]) => {
            console.log(`${code}: RGB(${color.r},${color.g},${color.b})`);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the processor
const imagePath = './exampleSchematic.png';
processWiringDiagram(imagePath);