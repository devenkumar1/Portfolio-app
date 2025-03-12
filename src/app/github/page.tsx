"use client";

import { useState, useEffect } from "react";
import { FaGithub, FaCodeBranch, FaStar, FaUsers, FaBook, FaCode, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { BiGitPullRequest } from "react-icons/bi";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface GitHubStats {
  user: {
    name: string;
    login: string;
    avatar_url: string;
    bio: string;
    followers: number;
    following: number;
    public_repos: number;
    location: string;
    blog: string;
    twitter_username: string;
    created_at: string;
  };
  repos: Array<{
    id: number;
    name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    html_url: string;
    created_at: string;
    updated_at: string;
  }>;
  contributions: {
    totalContributions: number;
  };
  pullRequests: {
    totalCount: number;
    nodes: Array<{
      title: string;
      url: string;
      state: string;
      createdAt: string;
    }>;
  };
  issues: {
    totalCount: number;
    nodes: Array<{
      title: string;
      url: string;
      state: string;
      createdAt: string;
    }>;
  };
}

export default function GitHubPage() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const username = "devenkumar1";

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();

        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        if (!reposResponse.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const reposData = await reposResponse.json();

        // Initialize stats with the data we have
        const initialStats: GitHubStats = {
          user: userData,
          repos: reposData,
          contributions: { totalContributions: 0 },
          pullRequests: { totalCount: 0, nodes: [] },
          issues: { totalCount: 0, nodes: [] }
        };

        // Try to fetch additional data if token is available
        if (process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
          try {
            const contributionsQuery = `
              query($username: String!) {
                user(login: $username) {
                  contributionsCollection {
                    contributionCalendar {
                      totalContributions
                    }
                  }
                  pullRequests(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
                    totalCount
                    nodes {
                      title
                      url
                      state
                      createdAt
                    }
                  }
                  issues(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
                    totalCount
                    nodes {
                      title
                      url
                      state
                      createdAt
                    }
                  }
                }
              }
            `;

            const graphqlResponse = await fetch('https://api.github.com/graphql', {
              method: 'POST',
              headers: {
                'Authorization': `bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                query: contributionsQuery,
                variables: { username }
              }),
            });

            if (!graphqlResponse.ok) {
              throw new Error('GraphQL request failed');
            }

            const graphqlData = await graphqlResponse.json();
            
            if (graphqlData.errors) {
              console.error('GraphQL Errors:', graphqlData.errors);
              throw new Error(graphqlData.errors[0].message);
            }

            if (graphqlData.data?.user) {
              initialStats.contributions = {
                totalContributions: graphqlData.data.user.contributionsCollection.contributionCalendar.totalContributions
              };
              initialStats.pullRequests = graphqlData.data.user.pullRequests;
              initialStats.issues = graphqlData.data.user.issues;
            }
          } catch (graphqlError) {
            console.error('GraphQL Error:', graphqlError);
            // Don't throw here, we'll still show the basic profile with repos
          }
        }

        setStats(initialStats);
      } catch (error) {
        console.error("Error fetching GitHub stats:", error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        <div className="container mx-auto px-6 pt-32 pb-20">
          <div className="space-y-8">
            {/* Profile skeleton */}
            <div className="flex items-center gap-6">
              <Skeleton className="w-32 h-32 rounded-full bg-gray-800" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-48 bg-gray-800" />
                <Skeleton className="h-4 w-96 bg-gray-800" />
              </div>
            </div>
            
            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 bg-gray-800 rounded-lg" />
              ))}
            </div>
            
            {/* Repositories skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48 bg-gray-800 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <FaGithub className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-2">Error loading GitHub stats</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <FaGithub className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-2">Failed to load GitHub stats</h1>
          <p className="text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="space-y-12">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative w-48 h-48">
              <img
                src={stats.user.avatar_url}
                alt={stats.user.name}
                className="rounded-full border-4 border-blue-500/20"
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full">
                <FaGithub className="w-6 h-6" />
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{stats.user.name}</h1>
              <h2 className="text-xl text-gray-400 mb-4">@{stats.user.login}</h2>
              <p className="text-gray-300 max-w-2xl mb-6">{stats.user.bio}</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <FaUsers className="w-4 h-4" />
                  <span>{stats.user.followers} followers</span>
                </a>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full text-white">
                  <FaUsers className="w-4 h-4 " />
                  <span >{stats.user.following} following</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
                  <FaBook className="w-4 h-4" />
                  <span>{stats.user.public_repos} repositories</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* <Card className="p-6 bg-gray-800/50 border-gray-700/50 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <FaCode className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Contributions</p>
                  <h3 className="text-2xl font-bold">{stats.contributions?.totalContributions || 0}</h3>
                </div>
              </div>
            </Card> */}

            <Card className="p-6 bg-gray-800/50 border-gray-700/50 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <BiGitPullRequest className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Pull Requests</p>
                  <h3 className="text-2xl font-bold">{stats.pullRequests?.totalCount || 0}</h3>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gray-800/50 border-gray-700/50 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-full">
                  <FaExclamationCircle className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Issues</p>
                  <h3 className="text-2xl font-bold">{stats.issues?.totalCount || 0}</h3>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gray-800/50 border-gray-700/50 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <FaStar className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Stars</p>
                  <h3 className="text-2xl font-bold">
                    {stats.repos?.reduce((acc, repo) => acc + repo.stargazers_count, 0) || 0}
                  </h3>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Pull Requests */}
            <Card className="p-6 bg-gray-800/50 border-gray-700/50 text-white">
              <h3 className="text-xl font-semibold mb-4">Recent Pull Requests</h3>
              <div className="space-y-4">
                {stats.pullRequests?.nodes.slice(0, 5).map((pr) => (
                  <a
                    key={pr.url}
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-blue-400">{pr.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(pr.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        pr.state === 'OPEN' ? 'bg-green-500/20 text-green-400' :
                        pr.state === 'MERGED' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {pr.state}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </Card>

            {/* Recent Issues */}
            <Card className="p-6 bg-gray-800/50 border-gray-700/50 text-white">
              <h3 className="text-xl font-semibold mb-4">Recent Issues</h3>
              <div className="space-y-4">
                {stats.issues?.nodes.slice(0, 5).map((issue) => (
                  <a
                    key={issue.url}
                    href={issue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-blue-400">{issue.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        issue.state === 'OPEN' ? 'bg-green-500/20 text-green-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {issue.state}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </Card>
          </div>

          {/* Latest Repositories */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Recently updated Repositories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="p-6 bg-gray-800/50 border-gray-700/50 hover:border-blue-500/50 transition-all">
                    <h3 className="text-xl font-semibold mb-2 text-blue-400">{repo.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {repo.description || "No description available"}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {repo.language && (
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                          {repo.language}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <FaStar className="w-4 h-4" />
                        {repo.stargazers_count}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <FaCodeBranch className="w-4 h-4" />
                        {repo.forks_count}
                      </div>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 