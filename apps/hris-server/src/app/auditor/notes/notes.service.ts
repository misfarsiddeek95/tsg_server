import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { AddNoteByAuditorDto, AddNoteDto, UpdateNoteDto } from './notes.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async addNote(data: AddNoteDto, userId: number) {
    try {
      const note = await this.prisma.auditorNote.create({
        data: {
          text: data.note,
          auditorId: userId
        }
      });
      return { success: true, data: note };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async updateNote(data: UpdateNoteDto) {
    try {
      const note = await this.prisma.auditorNote.update({
        where: {
          id: data.id
        },
        data: {
          text: data.note
        },
        include: {
          candidate: {
            include: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          },
          auditor: {
            include: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          }
        }
      });
      return {
        success: true,
        data: {
          candidateShortName:
            note.candidate?.approved_personal_data?.shortName ?? '',
          isCurrentAuditor: true,
          auditorShortName:
            note.auditor?.approved_personal_data?.shortName ?? '',
          auditorId: note.auditorId ?? '',
          candidateId: note.candidateId ?? '',
          id: note.id ?? '',
          createdAt: note.createdAt ?? '',
          text: note.text ?? ''
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  // ‘final audit pass’
  // ‘initial audit pass’
  // ‘initial audit fail’
  // ‘inactive’
  // ‘resigned’
  // ‘active’
  // ‘audit pending’
  // ‘audit in progress’
  // ‘final audit fail’
  // ‘onboarding ready’
  // ‘login pending’
  // ‘initial audit reject’
  // ‘contract audit pass’
  // ‘contract audit fail’

  // fetch all notes by auditorId
  async fetchNotes(auditorId: number) {
    return { success: true, data: [] };
    try {
      const usersWithNotes = await this.prisma.hrisProgress.findMany({
        where: {
          // auditorId: auditorId,
          // tutorStatus: {
          //   in: ['audit in progress', 'audit pending', 'initial audit fail', 'final audit fail', 'contract audit fail']
          // }
        },
        include: {
          user: {
            include: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              },
              auditorNoteByCandidate: {
                include: {
                  auditor: {
                    include: {
                      approved_personal_data: {
                        select: {
                          shortName: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      // usersWithNotes.map((usersWithNotes) => {
      //   const shortName = usersWithNotes.user.approved_personal_data?.shortName

      //   return usersWithNotes.user.auditorNoteByCandidate.map((note) => {
      //     return {
      //       shortName,
      //       ...note
      //     }
      //   })

      // })

      // const notes = await this.prisma.auditorNote.findMany({
      //   where: {
      //     auditorId
      //   },
      //   orderBy: {
      //     id: 'desc'
      //   },
      //   take: 10
      // });

      const notes = usersWithNotes.flatMap((t) => {
        const tutorStatus = t.tutorStatus;
        return t.user.auditorNoteByCandidate.map((m) => {
          return {
            tutorStatus,
            isCurrentAuditor: m.auditorId === auditorId,
            candidateShortName: t.user.approved_personal_data?.shortName,
            auditorShortName: m.auditor.approved_personal_data?.shortName,
            auditorId: m.auditorId,
            candidateId: m.candidateId,
            id: m.id,
            createdAt: m.createdAt,
            text: m.text
          };
        });
      });

      return { success: true, data: notes };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async addNoteByAuditor(data: AddNoteByAuditorDto, userId: number) {
    try {
      const note = await this.prisma.auditorNote.create({
        data: {
          text: data.note,
          auditorId: userId,
          candidateId: data.candidateId
        },
        include: {
          candidate: {
            include: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          },
          auditor: {
            include: {
              approved_personal_data: {
                select: {
                  shortName: true
                }
              }
            }
          }
        }
      });
      return {
        success: true,
        data: {
          candidateShortName:
            note.candidate.approved_personal_data?.shortName ?? '',
          isCurrentAuditor: true,
          auditorShortName:
            note.auditor.approved_personal_data?.shortName ?? '',
          auditorId: note.auditorId ?? '',
          candidateId: note.candidateId ?? '',
          id: note.id ?? '',
          createdAt: note.createdAt ?? '',
          text: note.text ?? ''
        }
      };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }

  async fetchNotesByCandidate(candidateId: number) {
    try {
      const notes = await this.prisma.auditorNote.findMany({
        where: {
          candidateId
        },
        select: {
          auditor: true
        },
        orderBy: {
          id: 'desc'
        },
        take: 10
      });
      return { success: true, data: notes };
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}
