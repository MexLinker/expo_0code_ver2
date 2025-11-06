import React from 'react';

import { Text, View, Pressable, Switch } from '@/components/ui';
import { showError } from '@/components/ui/utils';
import { useUpdateRow } from '@/api/wordsearch/use-update-row';

export function RowCard({ item, table, onUpdated }: { item: any; table?: string; onUpdated: () => void }) {
  const lemma = safeString(item?.Lemma);
  const summary = safeString(item?.Summary ?? item?.explain ?? item?.defination);
  const definition = safeString(item?.defination ?? item?.explain);
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const { meetValue, setMeetValue, isFavorite, isPending, onToggleFavorite } = useFavoriteRow(
    item,
    table,
    onUpdated
  );
  return (
    <View className="m-2 overflow-hidden rounded-xl border border-neutral-300 bg-white p-3 dark:bg-neutral-900">
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel="toggle-details"
        testID={`favoritte-toggle-details-${String(item?.id ?? '')}`}
      >
        <RowHeaderContent lemma={lemma} summary={summary} definition={definition} id={item?.id} />
      </Pressable>

      <FavoriteToggle
        checked={isFavorite}
        onChange={onToggleFavorite}
        disabled={isPending || !item?.id || !table}
        testID={`favoritte-favorite-switch-${String(item?.id ?? '')}`}
      />

      <FavoritteDetails expanded={expanded} item={item} />

      <Text className="pt-2 text-xs text-primary-500">Tap to {expanded ? 'hide' : 'show'} details</Text>
    </View>
  );
}

function useFavoriteRow(item: any, table: string | undefined, onUpdated: () => void) {
  const meetDefault = safeString(item?.['meet']);
  const [meetValue, setMeetValue] = React.useState<string>(meetDefault);
  React.useEffect(() => setMeetValue(meetDefault), [meetDefault]);
  const { mutate, isPending } = useUpdateRow();
  const isFavorite = isNonEmpty(meetValue);
  const onToggleFavorite = React.useCallback(
    (checked: boolean) => {
      if (!item?.id || !table) return;
      const value = checked ? 'favorite' : '';
      setMeetValue(value);
      mutate(
        { id: item?.id, data: { ['meet']: value }, table },
        {
          onSuccess: onUpdated,
          onError: (err) => showError(err),
        }
      );
    },
    [item?.id, table, mutate, onUpdated]
  );
  return { meetValue, setMeetValue, isFavorite, isPending, onToggleFavorite };
}

function RowHeaderContent({
  lemma,
  summary,
  definition,
  id,
}: {
  lemma: string;
  summary: string;
  definition: string;
  id?: any;
}) {
  return (
    <View>
      <Text className="text-xl font-semibold">{lemma || 'Untitled'}</Text>
      {summary ? <Text className="pt-1 text-neutral-700 dark:text-neutral-200">{summary}</Text> : null}
      {definition ? <Text className="pt-1 text-neutral-600">{definition}</Text> : null}
      <Text className="pt-2 text-xs text-neutral-400">ID: {String(id ?? '—')}</Text>
    </View>
  );
}

function FavoriteToggle({
  checked,
  onChange,
  disabled,
  testID,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled: boolean;
  testID: string;
}) {
  return (
    <View className="pt-2">
      <Switch
        label="Favorite"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        accessibilityLabel="favorite"
        testID={testID}
      />
    </View>
  );
}

function FavoritteDetails({ expanded, item }: { expanded: boolean; item: any }) {
  if (!expanded) return null;
  return (
    <View className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-800">
      <Text className="pb-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300">Full Data</Text>
      <RecordTable record={item} />
    </View>
  );
}

function RecordTable({ record }: { record: Record<string, any> }) {
  const entries = React.useMemo(() => {
    try {
      return Object.keys(record ?? {}).sort((a, b) => a.localeCompare(b));
    } catch {
      return [] as string[];
    }
  }, [record]);
  if (!entries.length) {
    return <Text className="text-xs text-neutral-500">No data</Text>;
  }
  return (
    <View>
      {entries.map((key) => (
        <View key={key} className="flex-row py-1">
          <Text className="w-36 pr-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">{key}</Text>
          <Text className="flex-1 text-xs text-neutral-600 dark:text-neutral-200">{safeString(record[key])}</Text>
        </View>
      ))}
    </View>
  );
}

function safeString(v: any): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function isNonEmpty(v: any): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  try {
    return String(v).trim().length > 0;
  } catch {
    return false;
  }
}