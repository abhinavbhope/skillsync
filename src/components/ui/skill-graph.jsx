'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SkillGraph = ({ graphData }) => {
  const mountRef = useRef(null);
  const animationFrameId = useRef(null);

  useEffect(() => {
    if (!graphData || !graphData.nodes || !graphData.edges) {
        return;
    }
    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const nodes = {};
    const nodeGroup = new THREE.Group();

    // Create nodes
    graphData.nodes.forEach((nodeData, i) => {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x00eeff });
        const node = new THREE.Mesh(geometry, material);

        // Position nodes in a circle
        const angle = (i / graphData.nodes.length) * Math.PI * 2;
        node.position.x = 10 * Math.cos(angle);
        node.position.y = 10 * Math.sin(angle);
        node.position.z = (Math.random() - 0.5) * 5;

        nodes[nodeData.id] = node;
        nodeGroup.add(node);
    });

    scene.add(nodeGroup);

    // Create edges
    const edgesGroup = new THREE.Group();
    graphData.edges.forEach(edgeData => {
        const sourceNode = nodes[edgeData.source];
        const targetNode = nodes[edgeData.target];

        if (sourceNode && targetNode) {
            const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
            const points = [sourceNode.position, targetNode.position];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            edgesGroup.add(line);
        }
    });

    scene.add(edgesGroup);
    
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
    currentMount.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      
      nodeGroup.rotation.y += 0.001;
      edgesGroup.rotation.y += 0.001;
      
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('mousemove', onMouseMove);
      if (currentMount) {
          while (currentMount.firstChild) {
              currentMount.removeChild(currentMount.firstChild);
          }
      }
      // Basic cleanup
      scene.children.forEach(child => {
          if (child instanceof THREE.Group) {
              child.children.forEach(c => {
                  c.geometry?.dispose();
                  c.material?.dispose();
              });
          }
      });
      renderer.dispose();
    };
  }, [graphData]);
  
  if (!graphData) {
      return (
        <div className="w-full h-full flex items-center justify-center text-center p-8">
            <p className="text-gray-400">Your visualized skill graph will appear here.</p>
        </div>
      )
  }

  return <div ref={mountRef} className="w-full h-full" />;
};

export default SkillGraph;
