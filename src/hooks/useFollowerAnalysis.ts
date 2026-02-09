import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loadSelections, saveSelections, clearSelections } from '@/utils/storage';
import { FollowerStatus, SelectionMap, SelectionStatus } from '@/types/follower';
import { toast } from 'sonner';
import {
  createDefaultFollowerAnalysisService,
  FollowerAnalysisService,
} from '@/services/FollowerAnalysisService';

type AnalysisDependencies = {
  analysisService: FollowerAnalysisService;
  storage: {
    load: typeof loadSelections;
    save: typeof saveSelections;
    clear: typeof clearSelections;
  };
  notify: {
    success: typeof toast.success;
    info: typeof toast.info;
  };
};

const defaultDependencies: AnalysisDependencies = {
  analysisService: createDefaultFollowerAnalysisService(),
  storage: {
    load: loadSelections,
    save: saveSelections,
    clear: clearSelections,
  },
  notify: {
    success: toast.success,
    info: toast.info,
  },
};

const EMPTY_SELECTIONS: SelectionMap = {};

const getStatusCounts = (users: FollowerStatus[]) => ({
  remove: users.filter((u) => u.status === 'remove').length,
  keep: users.filter((u) => u.status === 'keep').length,
  neutral: users.filter((u) => u.status === 'neutral').length,
});

const applySelections = (users: FollowerStatus[], selections: SelectionMap) =>
  users.map((user) => ({
    ...user,
    status: selections[user.username] ?? 'neutral',
  }));

const updateStatusInList = (
  users: FollowerStatus[],
  username: string,
  status: SelectionStatus
) => users.map((user) => (user.username === username ? { ...user, status } : user));

export const useFollowerAnalysis = (dependencies?: Partial<AnalysisDependencies>) => {
  const { analysisService, storage, notify } = useMemo(
    () => ({
      analysisService: dependencies?.analysisService ?? defaultDependencies.analysisService,
      storage: {
        load: dependencies?.storage?.load ?? defaultDependencies.storage.load,
        save: dependencies?.storage?.save ?? defaultDependencies.storage.save,
        clear: dependencies?.storage?.clear ?? defaultDependencies.storage.clear,
      },
      notify: {
        success: dependencies?.notify?.success ?? defaultDependencies.notify.success,
        info: dependencies?.notify?.info ?? defaultDependencies.notify.info,
      },
    }),
    [
      dependencies?.analysisService,
      dependencies?.storage?.load,
      dependencies?.storage?.save,
      dependencies?.storage?.clear,
      dependencies?.notify?.success,
      dependencies?.notify?.info,
    ]
  );

  const [followersContent, setFollowersContent] = useState('');
  const [followingContent, setFollowingContent] = useState('');
  const [followingButNotFollowingBack, setFollowingButNotFollowingBack] = useState<
    FollowerStatus[]
  >([]);
  const [followersNotFollowingBack, setFollowersNotFollowingBack] = useState<
    FollowerStatus[]
  >([]);
  const [selections, setSelections] = useState<SelectionMap>(EMPTY_SELECTIONS);
  const selectionsRef = useRef<SelectionMap>(EMPTY_SELECTIONS);

  useEffect(() => {
    const loadedSelections = storage.load();
    selectionsRef.current = loadedSelections;
    setSelections(loadedSelections);
  }, [storage]);

  const analyzeFollowers = useCallback(() => {
    const currentSelections = selectionsRef.current;
    const analysisResult = analysisService.analyze(
      followersContent,
      followingContent,
      currentSelections
    );

    setFollowingButNotFollowingBack(analysisResult.followingButNotFollowingBack);
    setFollowersNotFollowingBack(analysisResult.followersNotFollowingBack);

    notify.success('Análise concluída!', {
      description: `Encontrados ${analysisResult.followingButNotFollowingBack.length} usuários que você segue mas não seguem de volta.`,
    });
  }, [analysisService, followersContent, followingContent, notify]);

  useEffect(() => {
    if (followersContent && followingContent) {
      analyzeFollowers();
    }
  }, [followersContent, followingContent, analyzeFollowers]);

  const handleStatusChange = useCallback(
    (username: string, status: SelectionStatus) => {
      const newSelections = { ...selectionsRef.current, [username]: status };
      selectionsRef.current = newSelections;
      setSelections(newSelections);
      storage.save(newSelections);

      setFollowingButNotFollowingBack((prev) => updateStatusInList(prev, username, status));
      setFollowersNotFollowingBack((prev) => updateStatusInList(prev, username, status));

      notify.success('Status atualizado!');
    },
    [notify, storage]
  );

  const handleClearSelections = useCallback(() => {
    storage.clear();
    selectionsRef.current = EMPTY_SELECTIONS;
    setSelections(EMPTY_SELECTIONS);

    setFollowingButNotFollowingBack((prev) => applySelections(prev, EMPTY_SELECTIONS));
    setFollowersNotFollowingBack((prev) => applySelections(prev, EMPTY_SELECTIONS));

    notify.info('Todas as seleções foram limpas');
  }, [notify, storage]);

  const followingCounts = useMemo(
    () => getStatusCounts(followingButNotFollowingBack),
    [followingButNotFollowingBack]
  );

  const followersCounts = useMemo(
    () => getStatusCounts(followersNotFollowingBack),
    [followersNotFollowingBack]
  );

  return {
    followersContent,
    followingContent,
    setFollowersContent,
    setFollowingContent,
    followingButNotFollowingBack,
    followersNotFollowingBack,
    followingCounts,
    followersCounts,
    handleStatusChange,
    handleClearSelections,
  };
};
