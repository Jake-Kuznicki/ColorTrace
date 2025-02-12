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

        // Create an SVG overlay for the colored lines
        const svg = `
            <svg width="${metadata.width}" height="${metadata.height}">
                <style>
                    .wire { stroke-width: 2.5; fill: none; }
                </style>
                <!-- Main horizontal grey bar -->
                <path class="wire" stroke="rgb(128,128,128)" d="M 50,220 L ${metadata.width! - 150},220" />
                
                <!-- Top vertical wires -->
                <path class="wire" stroke="rgb(255,0,0)" d="M 80,50 L 80,220" /> <!-- ro/ge -->
                <path class="wire" stroke="rgb(0,255,0)" d="M 150,120 L 150,220" /> <!-- gn -->
                <path class="wire" stroke="rgb(255,0,0)" d="M 200,150 L 200,220" /> <!-- ro -->
                <path class="wire" stroke="rgb(0,0,255)" d="M 250,180 L 250,220" /> <!-- bl -->
                
                <!-- Bottom vertical wires -->
                <path class="wire" stroke="rgb(165,42,42)" d="M 80,220 L 80,400" /> <!-- br -->
                <path class="wire" stroke="rgb(0,0,255)" d="M 150,220 L 150,400" /> <!-- bl/ro -->
                <path class="wire" stroke="rgb(128,128,128)" d="M 250,220 L 250,400" /> <!-- gr/li -->
                <path class="wire" stroke="rgb(0,0,255)" d="M 300,220 L 300,400" /> <!-- bl/ro -->
                
                <!-- Right side connections -->
                <path class="wire" stroke="rgb(255,0,0)" d="M 400,220 L 400,400" /> <!-- ro/ge -->
                <path class="wire" stroke="rgb(0,0,0)" d="M 450,220 L 450,400" /> <!-- gn/ws -->
            </svg>`;

        // Composite the SVG over the original image
        const outputPath = join(__dirname, 'colored-diagram.png');
        await image
            .composite([
                {
                    input: Buffer.from(svg),
                    blend: 'over'
                }
            ])
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

// Run the processor with your image
const imagePath = join(__dirname, 'exampleSchematic.png');
processWiringDiagram(imagePath);