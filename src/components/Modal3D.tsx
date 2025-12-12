'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface Modal3DProps {
  modelUrl: string;
  damageAnalysis?: any;
  onClose: () => void;
}

export default function Modal3D({ modelUrl, damageAnalysis, onClose }: Modal3DProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !modelUrl || typeof window === 'undefined') return;

    const { current } = canvasRef;
    current.innerHTML = '';

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate-900 background
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      current.clientWidth / current.clientHeight, 
      0.1, 
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(current.clientWidth, current.clientHeight);
    current.appendChild(renderer.domElement);

    // Camera controls
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 20, 300);
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    scene.add(directionalLight);

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      modelUrl, 
      (gltf) => {
        console.log('Modal3D: 3D terrain model loaded successfully');
        scene.add(gltf.scene);
        controls.update();
      }, 
      (progress) => {
        console.log(`Loading: ${(progress.loaded / progress.total * 100).toFixed(0)}%`);
      },
      (err) => {
        console.error('GLTF load error in modal:', err);
      }
    );

    // Add damage visualization cubes if analysis data exists
    if (damageAnalysis?.features) {
      console.log('Modal3D: Rendering', damageAnalysis.features.length, 'damage zones');
      
      damageAnalysis.features.forEach((feat: any, index: number) => {
        const props = feat.properties;
        
        // Only show high-severity damage
        if (props?.severity > 7) {
          const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
          
          // Color based on damage type
          let color = 0xff0000; // Default red
          if (props.damageType === 'flood') color = 0x0088ff;
          if (props.damageType === 'collapse') color = 0xff6600;
          if (props.damageType === 'debris') color = 0xffaa00;
          
          const material = new THREE.MeshBasicMaterial({ 
            color, 
            wireframe: true,
            opacity: 0.7,
            transparent: true
          });
          
          const cube = new THREE.Mesh(geometry, material);
          
          // Position cubes in a grid pattern
          const row = Math.floor(index / 5);
          const col = index % 5;
          cube.position.set(
            (col - 2) * 0.3,  // Spread horizontally
            0.2,              // Slightly elevated
            row * 0.3         // Spread in depth
          );
          
          scene.add(cube);
        }
      });
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (current && renderer) {
        const { clientWidth, clientHeight } = current;
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(clientWidth, clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [modelUrl, damageAnalysis]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[85vh] bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden relative">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">3D Terrain Analysis</h3>
            <p className="text-sm text-slate-400 mt-1">Drone-generated damage assessment visualization</p>
          </div>
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <span>✕</span>
            Close
          </button>
        </div>

        {/* 3D Canvas */}
        <div ref={canvasRef} className="w-full h-[calc(100%-80px)] bg-slate-950" />

        {/* Legend */}
        {damageAnalysis?.features && (
          <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
            <h4 className="text-sm font-semibold text-white mb-2">Damage Types</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-slate-300">Structural</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-slate-300">Flood</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-slate-300">Collapse</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-slate-300">Debris</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}