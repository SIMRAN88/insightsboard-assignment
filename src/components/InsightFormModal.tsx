import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Toast from
  'react-native-toast-message';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  InsightFormData,
  insightSchema,
} from '../validation/insightSchema';
import styles from '../styles/InsightFormModal.styles';
import { Insight } from '../types/insight';
import { useQuery } from '@apollo/client/react';
import { GET_CATEGORIES, SEARCH_HCPS, GET_TAGS } from '../graphql/queries';
type CategoriesQueryData = {
  categoriesCollection: {
    edges: Array<{
      node: {
        id: string;
        name: string;
      };
    }>;
  };
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

type HcpsQueryData = {
  hcpsCollection: {
    edges: {
      node: {
        id: string;
        name: string;
        specialty: string;
        institution: string;
      };
    }[];
  };
};
type Props = {
  visible: boolean;

  insight?: Insight | null;

  onClose: () => void;

  onSubmit: (
    values: InsightFormData
  ) => Promise<void>;
};

const priorities = [
  'P1',
  'P2',
  'P3',
  'P4',
];

const stages = [
  'observation',
  'insight',
  'actionable',
  'impact',
];

export default function InsightFormModal({
  visible,
  insight,
  onClose,
  onSubmit,
}: Props) {
  const initialValues =
    useMemo(
      () => ({
        title:
          insight?.title ?? '',

        description:
          insight?.description ??
          '',

        priority:
          insight?.priority ??
          'P3',

        stage:
          insight?.stage ??
          'observation',

        drugName:
          insight?.drugName ??
          '',
        categoryId:
          insight?.category?.id ??
          '',
        hcpId:
          insight?.hcp?.id ??
          '',
        tags:
          insight?.tags ??
          [],
      }),
      [insight]
    );

  const { data: categoriesData } =
    useQuery<CategoriesQueryData>(GET_CATEGORIES);
  const [values, setValues] =
    useState<InsightFormData>(
      initialValues
    );
  const [saving, setSaving] =
    useState(false);
  const [errors, setErrors] =
    useState<
      Record<
        string,
        string
      >
    >({});

  const [dirty, setDirty] =
    useState(false);
  const [hcpSearch, setHcpSearch] =
    useState('');
  const { data: tagsData } =
    useQuery<TagsQueryData>(
      GET_TAGS
    );
  const [
    debouncedHcpSearch,
    setDebouncedHcpSearch,
  ] = useState('');
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const timer =
      setTimeout(() => {
        setDebouncedHcpSearch(
          hcpSearch
        );
      }, 300);

    return () =>
      clearTimeout(timer);
  }, [hcpSearch]);
  const validateField = (
    field: keyof InsightFormData,
    value: string
  ) => {
    const updatedValues = {
      ...values,
      [field]: value,
    };

    const result =
      insightSchema.safeParse(
        updatedValues
      );

    if (
      !result.success
    ) {
      const fieldError =
        result.error.issues.find(
          (error) =>
            error.path[0] ===
            field
        );

      setErrors(
        (current) => ({
          ...current,
          [field]:
            fieldError?.message ??
            '',
        })
      );
    } else {
      setErrors(
        (current) => ({
          ...current,
          [field]: '',
        })
      );
    }
  };

  const { data: hcpsData } =
    useQuery<HcpsQueryData>(
      SEARCH_HCPS,
      {
        variables: {
          filter:
            debouncedHcpSearch
              ? {
                name: {
                  ilike: `%${debouncedHcpSearch}%`,
                },
              }
              : undefined,
        },
      }
    );

  const toggleTag = (
    tagId: string
  ) => {
    const currentTags =
      values.tags ?? [];

    const updatedTags =
      currentTags.includes(
        tagId
      )
        ? currentTags.filter(
          (id) =>
            id !== tagId
        )
        : [
          ...currentTags,
          tagId,
        ];

    setDirty(true);

    setValues(
      (current) => ({
        ...current,
        tags:
          updatedTags,
      })
    );
  };

  const updateField = (
    field: keyof InsightFormData,
    value: string
  ) => {
    setDirty(true);

    setValues(
      (current) => ({
        ...current,
        [field]: value,
      })
    );

    validateField(
      field,
      value
    );
  };

  const handleClose =
    () => {
      if (!dirty) {
        onClose();
        return;
      }

      Alert.alert(
        'Discard changes?',
        'You have unsaved changes.',
        [
          {
            text: 'Cancel',
            style:
              'cancel',
          },
          {
            text: 'Discard',
            style:
              'destructive',
            onPress:
              onClose,
          },
        ]
      );
    };

  const handleSubmit =
    async () => {
      const result =
        insightSchema.safeParse(
          values
        );

      if (
        !result.success
      ) {
        const newErrors:
          Record<
            string,
            string
          > = {};

        result.error.issues.forEach(
          (error) => {
            const key =
              String(
                error.path[0]
              );

            newErrors[key] =
              error.message;
          }
        );

        setErrors(
          newErrors
        );

        return;
      }

      try {
        setSaving(true);

        await onSubmit(
          values
        );

        Toast.show({
          type: 'success',
          text1:
            'Saved successfully',
        });

        setDirty(false);

        setTimeout(() => {
          onClose();
        }, 1000);
      } finally {
        setSaving(false);
      }
    };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <ScrollView
            contentContainerStyle={
              styles.content
            }
          >
            <Text style={styles.title}>
              {insight
                ? 'Edit Insight'
                : 'New Insight'}
            </Text>

            {/* TITLE */}

            <Text style={styles.label}>
              Title *
            </Text>

            <TextInput
              placeholder="Title"
              value={values.title}
              onChangeText={(text) =>
                updateField(
                  'title',
                  text
                )
              }
              style={styles.input}
            />

            {errors.title && (
              <Text style={styles.error}>
                {errors.title}
              </Text>
            )}

            {/* DESCRIPTION */}

            <Text style={styles.label}>
              Description *
            </Text>

            <TextInput
              placeholder="Description"
              multiline
              value={
                values.description
              }
              onChangeText={(text) =>
                updateField(
                  'description',
                  text
                )
              }
              style={[
                styles.input,
                styles.multiline,
              ]}
            />

            {errors.description && (
              <Text style={styles.error}>
                {
                  errors.description
                }
              </Text>
            )}

            {/* PRIORITY */}

            <Text style={styles.label}>
              Priority
            </Text>

            <View
              style={
                styles.optionRow
              }
            >
              {priorities.map(
                (priority) => (
                  <Pressable
                    key={priority}
                    onPress={() =>
                      updateField(
                        'priority',
                        priority
                      )
                    }
                    style={[
                      styles.optionChip,

                      values.priority ===
                      priority &&
                      styles.selectedChip,
                    ]}
                  >
                    <Text>
                      {priority}
                    </Text>
                  </Pressable>
                )
              )}
            </View>

            {/* STAGE */}

            <Text style={styles.label}>
              Stage
            </Text>

            <View
              style={
                styles.optionRow
              }
            >
              {stages.map(
                (stage) => (
                  <Pressable
                    key={stage}
                    onPress={() =>
                      updateField(
                        'stage',
                        stage
                      )
                    }
                    style={[
                      styles.optionChip,

                      values.stage ===
                      stage &&
                      styles.selectedChip,
                    ]}
                  >
                    <Text>
                      {stage}
                    </Text>
                  </Pressable>
                )
              )}
            </View>

            {/* CATEGORY */}

            <Text style={styles.label}>
              Category
            </Text>

            <View
              style={
                styles.optionRow
              }
            >
              {categoriesData
                ?.categoriesCollection
                ?.edges
                ?.map(
                  (edge) => {
                    const category =
                      edge.node;

                    return (
                      <Pressable
                        key={
                          category.id
                        }
                        onPress={() =>
                          updateField(
                            'categoryId',
                            category.id
                          )
                        }
                        style={[
                          styles.optionChip,

                          values.categoryId ===
                          category.id &&
                          styles.selectedChip,
                        ]}
                      >
                        <Text>
                          {
                            category.name
                          }
                        </Text>
                      </Pressable>
                    );
                  }
                )}
            </View>

            {/*Linked HCP*/}
            <Text style={styles.label}>
              Linked HCP
            </Text>

            <TextInput
              placeholder="Search HCP..."
              value={hcpSearch}
              onChangeText={setHcpSearch}
              style={styles.input}
            />

            <View style={styles.hcpResults}>
              {hcpsData
                ?.hcpsCollection
                ?.edges
                ?.map((edge) => {
                  const hcp =
                    edge.node;

                  return (
                    <Pressable
                      key={hcp.id}
                      onPress={() => {
                        updateField(
                          'hcpId',
                          hcp.id
                        );

                        setHcpSearch(
                          hcp.name
                        );
                      }}
                      style={
                        styles.hcpRow
                      }
                    >
                      <Text
                        style={
                          styles.hcpName
                        }
                      >
                        {hcp.name}
                      </Text>

                      <Text
                        style={
                          styles.hcpMeta
                        }
                      >
                        {hcp.specialty}
                        {' • '}
                        {
                          hcp.institution
                        }
                      </Text>
                    </Pressable>
                  );
                })}
            </View>
            {/* TAGS */}

            <Text style={styles.label}>
              Tags
            </Text>

            <View style={styles.optionRow}>
              {tagsData
                ?.tagsCollection
                ?.edges
                ?.map((edge) => {
                  const tag =
                    edge.node;

                  const selected =
                    values.tags?.includes(
                      tag.id
                    );

                  return (
                    <Pressable
                      key={tag.id}
                      onPress={() =>
                        toggleTag(
                          tag.id
                        )
                      }
                      style={[
                        styles.optionChip,

                        selected &&
                        styles.selectedChip,
                      ]}
                    >
                      <Text
                        style={{
                          color:
                            selected
                              ? '#FFFFFF'
                              : '#111827',
                        }}
                      >
                        {tag.name}
                      </Text>
                    </Pressable>
                  );
                })}
            </View>

            {/* DRUG */}

            <Text style={styles.label}>
              Drug Name
            </Text>

            <TextInput
              placeholder="Drug Name"
              value={
                values.drugName
              }
              onChangeText={(text) =>
                updateField(
                  'drugName',
                  text
                )
              }
              style={styles.input}
            />

            {/* BUTTONS */}

            <View
              style={
                styles.actions
              }
            >
              <Pressable
                style={
                  styles.cancelButton
                }
                onPress={
                  handleClose
                }
              >
                <Text>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.submitButton,

                  saving &&
                  styles.disabledButton,
                ]}
                disabled={saving}
                onPress={
                  handleSubmit
                }
              >
                {saving ? (
                  <ActivityIndicator
                    color="#FFFFFF"
                  />
                ) : (
                  <Text
                    style={{
                      color:
                        '#FFFFFF',
                    }}
                  >
                    Save
                  </Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

