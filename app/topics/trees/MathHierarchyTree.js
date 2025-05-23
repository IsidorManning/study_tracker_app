"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { createClient } from '@supabase/supabase-js';
import { IconRestore, IconDownload } from '@tabler/icons-react';
import { IconButton } from '@mui/material';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function MathHierarchyTree() {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [fieldNotes, setFieldNotes] = useState({});
  const [fieldConnections, setFieldConnections] = useState({});
  const chartRef = useRef(null);

  const processData = useCallback((hierarchyData) => {
    const buildTree = (items, parentId = null) => {
      return items
        .filter(item => item.parent_id === parentId)
        .map(item => ({
          name: item.name,
          value: item.id,
          itemStyle: {
            color: item.mastered === 'mastered' ? '#4CAF50' : 
                   item.mastered === 'in_progress' ? '#FFC107' : '#ffffff'
          },
          children: buildTree(items, item.id),
          description: item.description,
          id: item.id
        }));
    };

    const mainBranches = buildTree(hierarchyData);
    return {
      name: 'Mathematics',
      children: mainBranches
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch hierarchy data
      const { data: hierarchyData, error: hierarchyError } = await supabase
        .from('field_hierarchy')
        .select('*')
        .eq('field_category', 'math');

      if (hierarchyError) {
        console.error('Error fetching hierarchy:', hierarchyError);
        return;
      }

      // Fetch field notes
      const { data: notesData, error: notesError } = await supabase
        .from('field_notes')
        .select('*');

      if (notesError) {
        console.error('Error fetching notes:', notesError);
      } else {
        const notesMap = {};
        notesData.forEach(note => {
          notesMap[note.field_id] = note.note;
        });
        setFieldNotes(notesMap);
      }

      // Fetch field connections
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('field_connections')
        .select('*');

      if (connectionsError) {
        console.error('Error fetching connections:', connectionsError);
      } else {
        const connectionsMap = {};
        connectionsData.forEach(conn => {
          if (!connectionsMap[conn.source_field_id]) {
            connectionsMap[conn.source_field_id] = [];
          }
          connectionsMap[conn.source_field_id].push({
            targetId: conn.target_field_id,
            description: conn.description
          });
        });
        setFieldConnections(connectionsMap);
      }

      const tree = processData(hierarchyData);
      setTreeData(tree);
      setLoading(false);
    };

    fetchData();
  }, [processData]);

  const getOption = () => ({
    backgroundColor: '#0a0a0a',
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: (params) => {
        if (params.dataType === 'edge') {
          return params.data.description;
        }
        const nodeId = params.data.id;
        const connections = fieldConnections[nodeId] || [];
        let tooltipContent = `${params.data.name}`;
        if (params.data.description) {
          tooltipContent += `<br/>${params.data.description}`;
        }
        tooltipContent += '<br/><br/>Click for more details';
        if (connections.length > 0) {
          tooltipContent += '<br/><br/>Prerequisites:';
          connections.forEach(conn => {
            tooltipContent += `<br/>- ${conn.description}`;
          });
        }
        return tooltipContent;
      },
      backgroundColor: '#0a0a0a0a0a0a',
      borderColor: '#ffffff',
      textStyle: {
        color: '#ffffff'
      }
    },
    series: [
      {
        type: 'tree',
        data: [treeData],
        top: '2%',
        left: '2%',
        bottom: '2%',
        right: '20%',
        symbolSize: 7,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 12,
          color: '#ffffff'
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        emphasis: {
          focus: 'descendant',
          itemStyle: {
            color: '#ffffff'
          }
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
        lineStyle: {
          color: '#ffffff',
          width: 1
        },
        draggable: true,
        roam: true,
        zoom: 0.8,
        select: {
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      }
    ]
  });

  const onChartReady = (echarts) => {
    echarts.resize();
    setTimeout(() => {
      echarts.dispatchAction({
        type: 'fitView'
      });
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-black">
      <div className="absolute top-4 right-4 bg-black z-10 flex gap-2 mr-2">
        <IconButton
          onClick={() => {
            if (chartRef.current) {
              chartRef.current.getEchartsInstance().dispatchAction({
                type: 'restore'
              });
              setTimeout(() => {
                chartRef.current.getEchartsInstance().dispatchAction({
                  type: 'fitView'
                });
              }, 100);
            }
          }}
          sx={{ 
            color: 'white',
            '&:hover': { 
              transform: 'scale(1.1)'
            }
          }}
        >
          <IconRestore size={20} />
        </IconButton>

        <IconButton
          onClick={() => {
            if (chartRef.current) {
              chartRef.current.getEchartsInstance().dispatchAction({
                type: 'saveAsImage'
              });
            }
          }}
          sx={{ 
            color: 'white',
            '&:hover': { 
              transform: 'scale(1.1)'
            }
          }}
        >
          <IconDownload size={20} />
        </IconButton>
      </div>

      {/* Detailed Sidebar */}
      {selectedNode && (
        <div className="absolute right-0 top-0 h-full w-80 bg-black border-l border-gray-800 p-4 overflow-y-auto">
          <div className="text-white">
            <h2 className="text-xl font-bold mb-4">{selectedNode.name}</h2>
            {selectedNode.description && (
              <p className="mb-4 text-gray-300">{selectedNode.description}</p>
            )}
            {fieldNotes[selectedNode.id] && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <p className="text-gray-300">{fieldNotes[selectedNode.id]}</p>
              </div>
            )}
            {fieldConnections[selectedNode.id] && fieldConnections[selectedNode.id].length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Prerequisites</h3>
                <ul className="list-disc pl-5 text-gray-300">
                  {fieldConnections[selectedNode.id].map((conn, index) => (
                    <li key={index} className="mb-1">{conn.description}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <ReactECharts
        ref={chartRef}
        option={getOption()}
        style={{ height: '100%'}}
        theme="dark"
        opts={{ renderer: 'canvas' }}
        onChartReady={onChartReady}
        onEvents={{
          'click': (params) => {
            if (params.dataType === 'node') {
              setSelectedNode(params.data);
            }
          }
        }}
        className="cursor-move"
      />
    </div>
  );
}
