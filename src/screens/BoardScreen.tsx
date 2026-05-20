import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';

import {
  useActionSheet,
} from '@expo/react-native-action-sheet';
import {
  RefreshControl,
} from 'react-native';
import {
  useMutation,
  useQuery,
} from '@apollo/client/react';
import { supabase } from '../services/supabase';
import InsightCard from '../components/InsightCard';
import {
  AppState
} from 'react-native';
import { UPDATE_INSIGHT_STAGE, CREATE_ACTIVITY, UPDATE_INSIGHT } from '../graphql/mutation';
import { GET_INSIGHTS, GET_TAGS } from '../graphql/queries';
import {
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {
  Insight,
  InsightStage,
  InsightsResponse,
} from '../types/insight';
import Toast from 'react-native-toast-message';
import InsightDetailModal from '../components/InsightDetailModal';
import InsightFormModal from '../components/InsightFormModal';
import { InsightFormData } from '../validation/insightSchema';

const stages: InsightStage[] = [
  'observation',
  'insight',
  'actionable',
  'impact',
];
type Row = {
  updated_by?: string;
  updated_by_name?: string;
};

type TagsQueryData = {
  tagsCollection: {
    edges: {
      node: {
        id: string;
        name: string;
      };
    }[];
  };
};

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(
    true,
  );
}

export default function BoardScreen() {
  const [
    selectedStage,
    setSelectedStage,
  ] = useState<InsightStage>(
    'observation'
  );
  const [
    usersSheetVisible,
    setUsersSheetVisible,
  ] = useState(false);
  const { showActionSheetWithOptions } =
    useActionSheet();
  const [
    onlineUsers,
    setOnlineUsers,
  ] = useState<
    {
      id: string;
      name: string;
      avatar: string;
    }[]
  >([]);

  const { data: tagsData } =
    useQuery<TagsQueryData>(
      GET_TAGS
    );

  const { data, loading, error, refetch } =
    useQuery<InsightsResponse>(
      GET_INSIGHTS
    );

  const [refreshing, setRefreshing] =
    useState(false);
  const [updateInsightStage] =
    useMutation(
      UPDATE_INSIGHT_STAGE
    );
  const [updateInsight] =
    useMutation(
      UPDATE_INSIGHT
    );
  const [createActivity] =
    useMutation(
      CREATE_ACTIVITY
    );
  const [localInsights, setLocalInsights] =
    useState<Insight[]>([]);
  const [search, setSearch] =
    useState('');
  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState('');
  const formatStage = (
    stage: string
  ) =>
    stage.charAt(0)
      .toUpperCase() +
    stage.slice(1);
  const [
    selectedInsight,
    setSelectedInsight,
  ] =
    useState<Insight | null>(
      null
    );

  const [
    currentUserId,
    setCurrentUserId,
  ] = useState('');

  const currentUserIdRef =
    useRef('');

  const selectedStageRef =
    useRef(selectedStage);

  const selectedInsightRef =
    useRef(selectedInsight);
  const [
    detailVisible,
    setDetailVisible,
  ] = useState(false);
  const [
    selectedPriorities,
    setSelectedPriorities,
  ] = useState<string[]>([]);

  const [formVisible, setFormVisible] =
    useState(false);
  useEffect(() => {

    const sub =
      AppState.addEventListener(
        'change',

        state => {

          if (
            state ===
            'background'
          ) {

            supabase
              .removeAllChannels();

          }

        }
      );

    return () => {

      sub.remove();

    };

  }, []);
  const [animatedIds, setAnimatedIds] =
    useState<string[]>([]);
  useEffect(() => {

    let presenceChannel:
      ReturnType<
        typeof supabase.channel
      >;

    const setupPresence =
      async () => {

        const {
          data,
        } =
          await supabase
            .auth
            .getUser();

        const user =
          data.user;

        if (!user)
          return;

        presenceChannel =
          supabase.channel(
            'online-users'
          );

        presenceChannel

          .on(
            'presence',

            {
              event: 'sync',
            },

            () => {

              const state =
                presenceChannel
                  .presenceState();

              const rawUsers =
                Object.values(
                  state
                )
                  .flat()
                  .map(
                    (entry: { presence_ref?: string; id?: string; name?: string; avatar?: string }) => ({

                      id: entry.id ?? entry.presence_ref ?? '',

                      name: entry.name ?? 'Anonymous',

                      avatar: entry.avatar ?? '',

                    })
                  );

              const uniqueUsers =
                Array.from(

                  new Map(

                    rawUsers.map(
                      user => [
                        user.id,
                        user,
                      ]
                    )

                  ).values()

                );

              setOnlineUsers(
                uniqueUsers
              );
            }
          )

          .subscribe(
            async status => {

              if (
                status ===
                'SUBSCRIBED'
              ) {

                await presenceChannel.track({

                  id: user.id,

                  name:
                    user.email ??
                    'Anonymous',

                  avatar:
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.email ?? 'U'
                    )
                    }&background=6366F1&color=fff`

                });
              }

            }
          );

      };

    setupPresence();

    return () => {

      if (
        presenceChannel
      ) {

        supabase.removeChannel(
          presenceChannel
        );

      }

    };

  }, []);
  useEffect(() => {

    const loadUser =
      async () => {

        const {
          data,
        } =
          await supabase
            .auth
            .getUser();

        setCurrentUserId(
          data.user?.id ??
          ''
        );
      };

    loadUser();

  }, []);
  useEffect(() => {

    currentUserIdRef.current =
      currentUserId;

  }, [currentUserId]);

  useEffect(() => {

    selectedStageRef.current =
      selectedStage;

  }, [selectedStage]);


  useEffect(() => {

    selectedInsightRef.current =
      selectedInsight;

  }, [selectedInsight]);

  useEffect(() => {

    if (data) {

      const mappedInsights =
        data.insightsCollection
          .edges
          .map(
            edge =>
              edge.node
          );

      setLocalInsights(
        mappedInsights
      );

    }

  }, [data]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);


  useEffect(() => {

    const formatStage = (
      stage: string
    ) =>
      stage.charAt(0)
        .toUpperCase() +
      stage.slice(1);

    const channel =
      supabase
        .channel(
          'insights-realtime'
        )

        .on(
          'postgres_changes',

          {
            event: '*',
            schema: 'public',
            table: 'insights',
          },

          payload => {

            const eventType =
              payload.eventType;

            const newRow =
              payload.new as Insight;

            const oldRow =
              payload.old as Partial<Insight>;

            /*
              IMPORTANT
            */
            console.log(
              'REALTIME EVENT',
              payload.eventType,
              payload.new,
            );

            const actorId = (newRow as Row)?.updated_by;

            const isOwnUpdate =
              actorId ===
              currentUserIdRef.current;

            /*
              INSERT
            */

            if (
              eventType === 'INSERT'
            ) {

              if (
                newRow.stage ===
                selectedStageRef.current
              ) {

                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );

                setLocalInsights(
                  current => [

                    newRow,

                    ...current.filter(
                      i =>
                        i.id !==
                        newRow.id
                    ),

                  ]
                );

                setAnimatedIds(prev => [
                  ...prev,
                  newRow.id,
                ]);

                setTimeout(() => {
                  setAnimatedIds(prev =>
                    prev.filter(
                      id => id !== newRow.id
                    )
                  );
                }, 1000);

              }

              if (!isOwnUpdate) {

                Toast.show({

                  type: 'success',

                  text1:
                    `Someone created '${newRow.title}'.`,

                });

              }

              return;
            }

            /*
              UPDATE
            */

            if (
              eventType === 'UPDATE'
            ) {

              const moved =
                oldRow.stage !==
                newRow.stage;



              if (moved) {

                const actor =
                  (newRow as Row)
                    ?.updated_by_name
                  ??
                  newRow.updatedByName
                  ??
                  'Someone';

                setLocalInsights(
                  current => {

                    /*
                      REMOVE OLD COPY
                    */

                    const withoutOld =
                      current.filter(
                        item =>
                          item.id !==
                          newRow.id
                      );

                    /*
                      INSERT UPDATED CARD
                    */

                    return [
                      {
                        ...newRow,
                      },

                      ...withoutOld,
                    ];

                  }
                );

                if (!isOwnUpdate) {
                  const truncatedTitle =

                    newRow.title.length > 18

                      ? `${newRow.title.slice(
                        0,
                        18
                      )}…`

                      : newRow.title;

                  Toast.show({

                    type: 'info',

                    text1:
                      `${actor} moved`,

                    text2:
                      `"${truncatedTitle}" to ${formatStage(
                        newRow.stage
                      )}.`,

                    visibilityTime: 4000,

                  });
                }

              }
              else {

                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );

                setLocalInsights(
                  current =>
                    current.map(
                      insight =>
                        insight.id === newRow.id
                          ? {
                            ...insight,
                            ...newRow,
                          }
                          : insight
                    )
                );

                if (
                  selectedInsightRef
                    .current?.id ===
                  newRow.id
                ) {

                  setSelectedInsight(
                    prev =>
                      prev
                        ? {
                          ...prev,
                          ...newRow,
                        }
                        : null
                  );

                }

              }
            }


          }

        )

        .subscribe();

    return () => {

      supabase.removeChannel(
        channel
      );

    };

  }, []);

  const togglePriority = (
    priority: string
  ) => {
    setSelectedPriorities(
      (current) => {
        if (
          current.includes(priority)
        ) {
          return current.filter(
            (item) =>
              item !== priority
          );
        }

        return [
          ...current,
          priority,
        ];
      }
    );
  };

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedPriorities([]);
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);

      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const openEditForm = (
    insight: Insight
  ) => {
    setSelectedInsight(insight);

    setFormVisible(true);
  };
  const openInsight = (
    insight: Insight
  ) => {
    setSelectedInsight(
      insight
    );

    setDetailVisible(true);
  };

  const insights =
    useMemo(
      () => localInsights,
      [localInsights]
    );
  const filteredInsights =
    useMemo(() => {
      return insights.filter(
        (insight) => {
          // stage filter
          const matchesStage =
            insight.stage ===
            selectedStage;

          // search filter
          const matchesSearch =
            debouncedSearch.length ===
            0 ||
            insight.title
              .toLowerCase()
              .includes(
                debouncedSearch.toLowerCase()
              ) ||
            insight.description
              ?.toLowerCase()
              .includes(
                debouncedSearch.toLowerCase()
              );

          // priority filter
          const matchesPriority =
            selectedPriorities.length ===
            0 ||
            selectedPriorities.includes(
              insight.priority
            );

          return (
            matchesStage &&
            matchesSearch &&
            matchesPriority
          );
        }
      );
    }, [
      insights,
      selectedStage,
      debouncedSearch,
      selectedPriorities,
    ]);

  const getCount = (
    stage: InsightStage
  ) => {
    return insights.filter(
      (insight) =>
        insight.stage === stage
    ).length;
  };


  const openMoveSheet = (
    insight: Insight
  ) => {

    const options = [
      'Observation',
      'Insight',
      'Actionable',
      'Impact',
      'Cancel',
    ];

    const cancelButtonIndex = 4;

    showActionSheetWithOptions(

      {
        options,
        cancelButtonIndex,
        title:
          'Move insight to…',
      },

      selectedIndex => {

        if (
          selectedIndex ===
          undefined
        ) {
          return;
        }

        if (
          selectedIndex ===
          cancelButtonIndex
        ) {
          return;
        }

        const stageMap:
          InsightStage[] = [
            'observation',
            'insight',
            'actionable',
            'impact',
          ];

        handleMoveStage(
          insight.id,
          stageMap[
          selectedIndex
          ]
        );

      }

    );

  };
  const handleMoveStage = async (
    insightId: string,
    newStage: string
  ) => {
    const previousInsights = [
      ...localInsights,
    ];
    const oldStage =
      localInsights.find(
        i =>
          i.id === insightId
      )?.stage;

    // optimistic update
    setLocalInsights((current) =>
      current.map((insight) =>
        insight.id === insightId
          ? {
            ...insight,
            stage:
              newStage as InsightStage,
          }
          : insight
      )
    );

    try {

      const {
        data: authData,
      } =
        await supabase
          .auth
          .getUser();

      const actorName =
        authData.user?.user_metadata
          ?.full_name
        ??
        authData.user?.user_metadata
          ?.name
        ??
        authData.user?.email
          ?.split('@')[0]
        ??
        'Someone';

      await updateInsightStage({

        variables: {

          filter: {
            id: {
              eq: insightId,
            },
          },

          set: {

            stage: newStage,

            updatedBy:
              currentUserId,

            updatedByName:
              actorName,

          },

        },

      });

      await logActivities({
        insightId,
        action: 'moved',
        changes: [
          {
            fieldName: 'stage',
            oldValue: oldStage,
            newValue: newStage,
          },
        ],
      });

    } catch (error) {
      // rollback
      setLocalInsights(
        previousInsights
      );

      Toast.show({
        type: 'error',
        text1: 'Failed to update stage',
      });

      console.error(
        'Failed to update stage',
        error
      );
    }
  };

  const logActivities = async ({
    insightId,
    action,
    changes,
  }: {
    insightId: string;

    action:
    | 'created'
    | 'edited'
    | 'moved';

    changes: {
      fieldName: string;

      oldValue?: string;

      newValue?: string;
    }[];
  }) => {

    const objects =
      changes.map(
        change => ({
          insightId,

          userId:
            currentUserId,

          action,

          fieldName:
            change.fieldName,

          oldValue:
            change.oldValue ?? '',

          newValue:
            change.newValue ?? '',
        })
      );

    console.log(
      'INSERT OBJECTS',
      objects
    );

    const result =
      await createActivity({
        variables: {
          input: objects,
        },
      });

    console.log(
      'INSERT RESULT',
      result
    );

    if (!changes.length)
      return;

    try {

      console.log(
        'ACTIVITY PAYLOAD',
        changes
      );

      const objects =
        changes.map(
          change => ({

            insightId,

            userId:
              currentUserId,

            action,

            fieldName:
              String(
                change.fieldName
              ),

            oldValue:
              String(
                change.oldValue ??
                ''
              ),

            newValue:
              String(
                change.newValue ??
                ''
              ),

          })
        );

      await createActivity({
        variables: {
          input: objects,
        },
      });

    } catch (error) {

      console.error(
        'Activity log failed',
        error
      );

    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  const handleFormSubmit = async (
    values: InsightFormData
  ) => {

    if (!selectedInsight)
      return;

    const changes = [];

    // TITLE

    if (
      selectedInsight.title !==
      values.title
    ) {
      changes.push({
        fieldName: 'title',

        oldValue:
          selectedInsight.title,

        newValue:
          values.title,
      });
    }

    // DESCRIPTION

    if (
      selectedInsight.description !==
      values.description
    ) {
      changes.push({
        fieldName:
          'description',

        oldValue:
          selectedInsight
            .description ??
          '',

        newValue:
          values.description,
      });
    }

    // PRIORITY

    if (
      selectedInsight.priority !==
      values.priority
    ) {
      changes.push({
        fieldName:
          'priority',

        oldValue:
          selectedInsight
            .priority,

        newValue:
          values.priority,
      });
    }

    // STAGE

    if (
      selectedInsight.stage !==
      values.stage
    ) {
      changes.push({
        fieldName: 'stage',

        oldValue:
          selectedInsight
            .stage,

        newValue:
          values.stage,
      });
    }

    // DRUG NAME

    if (
      selectedInsight.drugName !==
      values.drugName
    ) {
      changes.push({
        fieldName:
          'drugName',

        oldValue:
          selectedInsight
            .drugName ??
          '',

        newValue:
          values.drugName,
      });
    }

    // CATEGORY

    const nextCategoryName =
      values.categoryId ===
        selectedInsight.category?.id
        ? (
          selectedInsight
            .category?.name ?? ''
        )
        : 'Updated Category';
    if (
      selectedInsight
        .category?.name !==
      nextCategoryName
    ) {

      changes.push({
        fieldName:
          'category',

        oldValue:
          selectedInsight
            .category?.name ??
          '',

        newValue:
          nextCategoryName,
      });
    }

    // HCP

    const nextHcpName =
      values.hcpId ===
        selectedInsight.hcp?.id
        ? (
          selectedInsight
            .hcp?.name ?? ''
        )
        : 'Updated HCP';

    if (
      selectedInsight
        .hcp?.name !==
      nextHcpName
    ) {

      changes.push({

        fieldName: 'hcp',

        oldValue:
          selectedInsight
            .hcp?.name ??
          '',

        newValue:
          nextHcpName,
      });

    }

    // TAGS

    const nextTags =
      values.tags
        .map(tagId => {

          const tag =
            tagsData
              ?.tagsCollection
              ?.edges
              ?.find(
                edge =>
                  edge.node.id ===
                  tagId
              )?.node;

          return (
            tag?.name ??
            tagId
          );

        })
        .join(', ');

    const currentTags =
      selectedInsight.tags
        ?.join(', ') ?? '';

    if (
      currentTags !==
      nextTags
    ) {

      changes.push({
        fieldName: 'tags',

        oldValue:
          currentTags,

        newValue:
          nextTags,
      });
    }

    // UPDATED INSIGHT

    const updatedInsight: Insight = {

      ...selectedInsight,

      title:
        values.title,

      description:
        values.description,

      priority:
        values.priority,

      stage:
        values.stage as InsightStage,

      drugName:
        values.drugName,

      category:
        values.categoryId
          ? {
            id:
              values.categoryId,

            name:
              nextCategoryName,

            color:
              selectedInsight
                .category
                ?.color ??
              '#3B82F6',
          }
          : null,

      hcp:
        values.hcpId
          ? {
            id:
              values.hcpId,

            name:
              nextHcpName,

            specialty:
              selectedInsight
                .hcp?.specialty ??
              '',

            institution:
              selectedInsight
                .hcp?.institution ??
              '',
          }
          : null,

      tags:
        nextTags
          ? nextTags
            .split(', ')
          : [],
    };

    console.log(
      'UPDATED INSIGHT',
      updatedInsight
    );

    const {
      data: authData,
    } =
      await supabase
        .auth
        .getUser();

    const actorName =
      authData.user
        ?.user_metadata
        ?.full_name
      ??
      authData.user
        ?.user_metadata
        ?.name
      ??
      authData.user
        ?.email
        ?.split('@')[0]
      ??
      'Someone';

    await updateInsight({

      variables: {

        filter: {
          id: {
            eq:
              selectedInsight.id,
          },
        },

        set: {

          title:
            values.title,

          description:
            values.description,

          priority:
            values.priority,

          stage:
            values.stage,

          drugName:
            values.drugName,

          updatedBy:
            currentUserId,

          updatedByName:
            actorName,

        },

      },

    });

    setLocalInsights(
      current =>
        current.map(
          item =>
            item.id ===
              selectedInsight.id
              ? updatedInsight
              : item
        )
    );

    await logActivities({

      insightId:
        selectedInsight.id,

      action: 'edited',

      changes,

    });

    setSelectedInsight(
      updatedInsight
    );

    Toast.show({
      type: 'success',

      text1:
        'Saved successfully',
    });

    setFormVisible(false);
  };
return (
  <SafeAreaView style={styles.container}>

    {/* Top Row */}

    <View style={styles.topRow}>

      <TouchableOpacity
        onPress={() =>
          setUsersSheetVisible(true)
        }
      >

        <View style={styles.avatarStack}>

          {onlineUsers
            .slice(0, 3)
            .map((user, index) => (

              <Image
                key={user.id}
                source={{
                  uri:
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}`,
                }}
                style={[
                  styles.avatar,
                  {
                    marginLeft:
                      index === 0
                        ? 0
                        : -12,
                  },
                ]}
              />

            ))}

          {onlineUsers.length > 3 && (

            <View style={styles.moreBadge}>

              <Text style={styles.moreText}>
                +{onlineUsers.length - 3}
              </Text>

            </View>

          )}

        </View>

      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          await supabase.auth.signOut();
        }}
        style={styles.logoutButton}
      >

        <Text style={styles.logoutText}>
          Logout
        </Text>

      </TouchableOpacity>

    </View>

    {/* Stage Tabs */}

    <View style={styles.stageBar}>
      {stages.map((stage) => {
        const selected =
          selectedStage === stage;

        return (
          <Pressable
            key={stage}
            accessibilityLabel={`${stage} tab`}
            onPress={() =>
              setSelectedStage(stage)
            }
            style={[
              styles.stageButton,
              selected &&
              styles.selectedStageButton,
            ]}
          >
            <Text
              style={[
                styles.stageText,
                selected &&
                styles.selectedStageText,
              ]}
            >
              {stage.charAt(0).toUpperCase() +
                stage.slice(1)}
            </Text>

            <Text
              style={[
                styles.countText,
                selected &&
                styles.selectedStageText,
              ]}
            >
              {getCount(stage)}
            </Text>

          </Pressable>
        );
      })}
    </View>

      <View style={styles.filterContainer}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search insights..."
          style={styles.searchInput}
        />

        <View style={styles.priorityRow}>
          {['P1', 'P2', 'P3', 'P4'].map(
            (priority) => {
              const selected =
                selectedPriorities.includes(
                  priority
                );

              return (
                <Pressable
                  key={priority}
                  onPress={() =>
                    togglePriority(
                      priority
                    )
                  }
                  style={[
                    styles.priorityChip,
                    selected &&
                    styles.priorityChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityChipText,
                      selected &&
                      styles.priorityChipTextSelected,
                    ]}
                  >
                    {priority}
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>

        {(search.length > 0 ||
          selectedPriorities.length >
          0) && (
            <View
              style={styles.activeFilters}
            >
              {search.length > 0 && (
                <Pressable
                  onPress={() =>
                    setSearch('')
                  }
                  style={
                    styles.activeChip
                  }
                >
                  <Text>
                    {search} ✕
                  </Text>
                </Pressable>
              )}

              {selectedPriorities.map(
                (priority) => (
                  <Pressable
                    key={priority}
                    onPress={() =>
                      togglePriority(
                        priority
                      )
                    }
                    style={
                      styles.activeChip
                    }
                  >
                    <Text>
                      {priority} ✕
                    </Text>
                  </Pressable>
                )
              )}

              <Pressable
                onPress={clearFilters}
              >
                <Text
                  style={
                    styles.clearAll
                  }
                >
                  Clear all
                </Text>
              </Pressable>
            </View>
          )}
      </View>

      {/* Cards */}
      <FlatList
        data={filteredInsights}
        keyExtractor={(item) =>
          item.id
        }
        contentContainerStyle={
          styles.list
        }
        ListEmptyComponent={
          <View
            style={
              styles.emptyContainer
            }
          >
            <Text>
              No insights in this
              stage
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        renderItem={({ item }) => {



          return (

            // <Animated.View
            //   entering={
            //     animation === 'fadeIn'
            //       ? FadeIn.duration(350)
            //       : undefined
            //   }
            //   exiting={
            //     animation === 'fadeOut'
            //       ? FadeOut.duration(250)
            //       : undefined
            //   }
            // >
            <Animated.View
              style={{
                opacity:
                  animatedIds.includes(item.id)
                    ? 0.4
                    : 1,
              }}
            >
              <InsightCard
                insight={item}
                onPress={() =>
                  openInsight(item)
                }
                onLongPress={() =>
                  openMoveSheet(item)
                }
                onMoveStage={
                  handleMoveStage
                }
              />

            </Animated.View>

          );
        }}
      />

      <Modal
        visible={usersSheetVisible}
        transparent
        animationType="slide"
      >

        <TouchableOpacity
          activeOpacity={1}
          style={
            styles.sheetOverlay
          }
          onPress={() =>
            setUsersSheetVisible(
              false
            )
          }
        >

          <View
            style={
              styles.sheetContainer
            }
          >

            <View
              style={
                styles.sheetHandle
              }
            />

            <View
              style={
                styles.sheetHeader
              }
            >

              <Text
                style={
                  styles.sheetTitle
                }
              >
                Online Users
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setUsersSheetVisible(
                    false
                  )
                }
              >

                <Text
                  style={{
                    color: '#4F46E5',
                    fontWeight: '700',
                  }}
                >
                  Close
                </Text>

              </TouchableOpacity>

            </View>

            {
              onlineUsers.map(
                user => (

                  <View
                    key={user.id}
                    style={
                      styles.userRow
                    }
                  >

                    <Image
                      source={{
                        uri:
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )
                          }`,
                      }}
                      style={
                        styles.userAvatar
                      }
                    />

                    <View>

                      <Text
                        style={{
                          fontWeight: '700',
                        }}
                      >
                        {user.name}
                      </Text>

                      <Text
                        style={{
                          color: '#64748B',
                          fontSize: 12,
                        }}
                      >
                        Online now
                      </Text>

                    </View>

                  </View>

                ))
            }

          </View>

        </TouchableOpacity>

      </Modal>
      <InsightDetailModal
        visible={detailVisible}
        insight={selectedInsight}
        onClose={() =>
          setDetailVisible(false)
        }
        onEdit={() => {
          setDetailVisible(false);

          setFormVisible(true);
        }}
      />

      <InsightFormModal
        visible={formVisible}
        insight={selectedInsight}
        onClose={() =>
          setFormVisible(false)
        }
        onSubmit={handleFormSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 headerRow: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  paddingHorizontal: 16,
  paddingTop: 8,
  paddingBottom: 8,
},
topRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingTop: 8,
  paddingBottom: 12,
},

logoutButton: {
  backgroundColor: '#EEF2FF',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 10,
},

logoutText: {
  color: '#3F51B5',
  fontWeight: '700',
  fontSize: 14,
},


  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ---------- HEADER / ONLINE USERS ----------

  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#6366F1',
  },

  moreBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,

    marginLeft: -12,

    backgroundColor: '#4F46E5',

    justifyContent: 'center',
    alignItems: 'center',
  },

  moreText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },

  // ---------- STAGES ----------

  stageBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },

  stageButton: {
    flex: 1,

    paddingVertical: 12,

    borderRadius: 14,

    backgroundColor: '#E2E8F0',

    alignItems: 'center',
  },

  selectedStageButton: {
    backgroundColor: '#3F51B5',
  },

  stageText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize',
    color: '#0F172A',
  },

  selectedStageText: {
    color: '#FFFFFF',
  },

  countText: {
    marginTop: 4,
    fontSize: 12,
    color: '#475569',
  },

  // ---------- FILTERS ----------

  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  searchInput: {
    backgroundColor: '#FFFFFF',

    borderRadius: 14,

    paddingHorizontal: 16,
    paddingVertical: 12,

    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },

  priorityChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 999,

    backgroundColor: '#E2E8F0',
  },

  priorityChipSelected: {
    backgroundColor: '#3F51B5',
  },

  priorityChipText: {
    fontWeight: '600',
    color: '#0F172A',
  },

  priorityChipTextSelected: {
    color: '#FFFFFF',
  },

  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,

    marginTop: 12,

    alignItems: 'center',
  },

  activeChip: {
    backgroundColor: '#DBEAFE',

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 999,
  },

  clearAll: {
    color: '#EF4444',
    fontWeight: '700',
  },

  // ---------- LIST ----------

  list: {
    padding: 16,
    gap: 12,
  },

  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
  },

  // ---------- BOTTOM SHEET ----------

  sheetOverlay: {
    flex: 1,

    justifyContent: 'flex-end',

    backgroundColor:
      'rgba(0,0,0,0.35)',
  },

  sheetContainer: {
    backgroundColor: '#FFFFFF',

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    padding: 24,

    minHeight: 300,
  },

  sheetHandle: {
    width: 52,
    height: 5,

    borderRadius: 999,

    backgroundColor: '#CBD5E1',

    alignSelf: 'center',

    marginBottom: 18,
  },

  sheetHeader: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 20,
  },

  sheetTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },

  userRow: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingVertical: 12,

    borderBottomWidth: 1,

    borderBottomColor: '#F1F5F9',
  },

  userAvatar: {
    width: 44,
    height: 44,

    borderRadius: 22,

    marginRight: 14,

    backgroundColor: '#6366F1',
  },

});


